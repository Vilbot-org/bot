const { ButtonBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

const configs = require("../../../../config.json");

module.exports = async (client, interaction) => {
	const embedMsg = new EmbedBuilder().setTitle("Music queue!");

	const queue = client.player.getQueue(interaction.guildId);

	if (!queue || !queue.playing) {
		embedMsg.setColor(configs.colors.danger).setDescription(":x: No songs in the queue!");

		return interaction.reply({
			embeds: [embedMsg],
		});
	}

	const skipingMessage = new EmbedBuilder()
		.setColor(configs.colors.success)
		.setTitle(":track_next: Skipping the song")
		.setDescription(
			queue.tracks.length > 0
				? `The next song is ${queue.tracks[0].title}`
				: "There are no more songs in the queue!"
		);

	const membersInVoice = interaction.member.voice.channel.members;
	//The votation only start if have more than 3 persons in the voice channel (include the bot)
	if (membersInVoice.size > 3) {
		let votes = 0;

		const voteMsg = new EmbedBuilder()
			.setColor(configs.colors.info)
			.setTitle("Votation to skip the current song")
			.setDescription(`Do you want to skip the current song?`);
		//Votation to skip the current song
		const row = new ActionRowBuilder()
			.addComponents(new ButtonBuilder().setCustomId("yes").setLabel("Yes").setStyle(ButtonStyle.Success))
			.addComponents(new ButtonBuilder().setCustomId("no").setLabel("No").setStyle(ButtonStyle.Danger));

		//Send the votation
		const reply = await interaction.reply({ embeds: [voteMsg], components: [row], fetchReply: true });

		//Create the collector and set the duration in 1min
		const collector = reply.createMessageComponentCollector({ time: 60000 });

		//Listened the collected events
		collector.on("collect", async i => {
			//Filter to view if the person who vote is in the voice channel
			const canResponse = membersInVoice.find(member => {
				return member.id == i.user.id;
			});

			//Check if the user who clicked the button is in the voice channel
			if (canResponse) {
				switch (i.customId) {
					case "yes":
						votes++;
						break;
				}

				//Skip the current song if have the necessary votes (50% of the listeners)
				if (votes >= membersInVoice.size / 2) {
					queue.skip();
					return i.reply({ embeds: [skipingMessage] });
				} else {
					await i.reply({
						embeds: [new EmbedBuilder().setColor(configs.colors.info).setTitle("Thanks for voting!")],
						ephemeral: true,
					});
				}
			} else
				i.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(configs.colors.danger)
							.setTitle("You need to be in a voice channel to vote!"),
					],
					ephemeral: true,
				});
		});

		//After the event ended the voting was removed
		collector.on("end", collected => {
			interaction.deleteReply();
		});
	} else {
		queue.skip();
		return interaction.reply({ embeds: [skipingMessage] });
	}
};

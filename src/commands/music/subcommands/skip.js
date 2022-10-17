const { ButtonBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

const { colors } = require("../../../config.json");

module.exports = async (client, interaction) => {
	const queue = await client.player.getQueue(interaction.guildId);

	if (!queue || !queue.playing)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Music queue!")
					.setColor(colors.danger)
					.setDescription(":x: No songs in the queue!"),
			],
			ephemeral: true,
		});

	const skipingMessage = new EmbedBuilder()
		.setColor(colors.success)
		.setAuthor({ name: "Skipping the song" })
		.setTitle(`:track_next: ${queue.tracks[0].title}`)
		.setURL(`${queue.tracks[0].url}`)
		.setDescription(
			queue.tracks[1]
				? `The next song is: [${queue.tracks[1].title}](${queue.tracks[1].url})`
				: "There are no more songs in the queue!"
		);

	const membersInVoice = interaction.member.voice.channel.members;

	//The votation dont start if have less than 4 persons in the voice channel (include the bot)
	if (membersInVoice < 4) {
		queue.skip();
		return await interaction.reply({ embeds: [skipingMessage] });
	}

	let votes = 0;
	let peopleVoted = [];

	//Votation to skip the current song
	const row = new ActionRowBuilder()
		.addComponents(new ButtonBuilder().setCustomId("yes").setLabel("Yes").setStyle(ButtonStyle.Success))
		.addComponents(new ButtonBuilder().setCustomId("no").setLabel("No").setStyle(ButtonStyle.Danger));

	//Send the votation
	const reply = await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.info)
				.setTitle("Votation to skip the current song")
				.setDescription(`Do you want to skip the current song?`),
		],
		components: [row],
		fetchReply: true,
	});

	//Create the collector and set the duration in 1min
	const collector = await reply.createMessageComponentCollector({ time: 60000 });

	let deletedMsg = false;
	//Listened the collected events
	collector.on("collect", async i => {
		//check if the user has already voted
		if (peopleVoted.indexOf(i.client.user.id) != -1)
			return await i.reply({
				embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: You have already voted!")],
				ephemeral: true,
			});

		peopleVoted.push(i.client.user.id);
		//Filter to view if the person who vote is in the voice channel
		const canResponse = membersInVoice.find(member => {
			return member.id == i.user.id;
		});

		//Check if the user who clicked the button is in the voice channel
		if (canResponse) {
			if (i.customId == "yes") votes++;

			if (votes >= membersInVoice.size / 2) {
				//Skip the current song if have the necessary votes (50% of the listeners)
				deletedMsg = true;
				await interaction.deleteReply();
				await queue.skip();
				return await i.reply({ embeds: [skipingMessage] });
			} else {
				await i.reply({
					embeds: [new EmbedBuilder().setColor(colors.info).setTitle("Thanks for voting!")],
					ephemeral: true,
				});
			}
		} else
			await i.reply({
				embeds: [
					new EmbedBuilder().setColor(colors.danger).setTitle("You need to be in a voice channel to vote!"),
				],
				ephemeral: true,
			});
	});

	//After the event ended the voting was removed
	collector.on("end", collected => {
		if (!deletedMsg) interaction.deleteReply();
	});
};

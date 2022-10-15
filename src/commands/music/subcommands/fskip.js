const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const { colors } = require("../../../config.json");

module.exports = async (client, interaction) => {
	const embedMsg = new EmbedBuilder().setTitle("Music queue!");

	const queue = await client.player.getQueue(interaction.guildId);

	if (!queue || !queue.playing)
		return await interaction.reply({
			embeds: [embedMsg.setColor(colors.danger).setDescription(":x: No songs in the queue!")],
			ephemeral: true,
		});

	//Check if the user can moderate
	if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
		return await interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(colors.danger).setTitle(":x: You don't have permission to do that!"),
			],
			ephemeral: true,
		});

	let skipingMessage = new EmbedBuilder()
		.setColor(colors.success)
		.setAuthor({ name: "Forcing the skip of the song" });

	if (queue.tracks.length > 0) {
		skipingMessage
			.setTitle(`:track_next: ${queue.tracks[0].title}`)
			.setURL(`${queue.tracks[0].url}`)
			.setDescription(
				queue.tracks[1]
					? `The next song is:  [${queue.tracks[1].title}](${queue.tracks[1].url})`
					: "There are no more songs in the queue!"
			);
	} else {
		skipingMessage.setTitle(":wave: Bye bye!").setDescription("No more songs in the queue");
	}

	await queue.skip();

	return await interaction.reply({
		embeds: [skipingMessage],
	});
};

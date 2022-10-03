const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../../../config.json");

module.exports = async (client, interaction) => {
	const queue = await client.player.getQueue(interaction.guildId);

	if (!queue)
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Music in not playing!")],
			ephemeral: true,
		});

	//If only have one song
	if (queue.previousTracks.length <= 1)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(colors.danger).setTitle(":x: There are no previous songs in the queue"),
			],
			ephemeral: true,
		});

	const currentSong = await queue.current;
	const previousSong = await queue.previousTracks[queue.previousTracks.length - 2];
	await queue.insert(previousSong);
	await queue.insert(currentSong, 1);
	await queue.skip();

	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.success)
				.setAuthor({ name: "Return to the previous song" })
				.setTitle(`:track_previous: ${previousSong.title}`)
				.setURL(`${previousSong.url}`)
				.setDescription(`Next song: [${currentSong.title}](${currentSong.url})`),
		],
	});
};

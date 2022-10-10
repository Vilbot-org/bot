const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../../../config.json");

module.exports = async (client, interaction, snipe) => {
	const songToRemove = interaction.options.getString("song");
	const playlist = interaction.options.getString("playlist")
		? interaction.options.getString("playlist")
		: `${interaction.user.username}-playlist`;

	//Check if the number is valid
	if (songToRemove <= 0) {
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Please enter a valit number song.")],
			ephemeral: true,
		});
	}

	const userPlaylist = await snipe.findOneAndUpdate(
		{
			userId: interaction.user.id,
			playlistName: playlist,
			"playlist.id": songToRemove,
		},
		{ $pull: { playlist: { id: songToRemove } } },
		{ multi: true }
	);

	if (!userPlaylist)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.danger)
					.setTitle(`:x: The song you have indicated does not exist in the playlist!`)
					.setDescription("Please check the song and try again."),
			],
			ephemeral: true,
		});

	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.green)
				.setAuthor({ name: "Remove song to playlist" })
				.setTitle(`The song has been success removed to the **${playlist}** playlist`),
		],
		ephemeral: true,
	});
};

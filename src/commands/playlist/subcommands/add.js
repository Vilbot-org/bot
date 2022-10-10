const { QueryType } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../../../config.json");

module.exports = async (client, interaction, snipe) => {
	const songToAdd = interaction.options.getString("song");
	const playlist = interaction.options.getString("playlist")
		? interaction.options.getString("playlist")
		: `${interaction.user.username}-playlist`;

	//Check if the song is a Youtube URL
	try {
		let urlSong = new URL(songToAdd);
		//If the host is not youtube generate a error
		if (urlSong.hostname != "www.youtube.com") throw new SyntaxError("It's not a Youtube URL");
	} catch (error) {
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.danger)
					.setDescription(":x: The song need to be a valid Youtube URL!"),
			],
			ephemeral: true,
		});
	}

	const result = await client.player.search(songToAdd, {
		requestedBy: interaction.user,
		searchEngine: QueryType.YOUTUBE_VIDEO,
	});
	const song = result.tracks[0];

	const userPlaylist = await snipe.findOneAndUpdate(
		{ userId: interaction.user.id, playlistName: playlist },
		{ $push: { playlist: { id: song.id, title: song.title, url: song.url } } }
	);

	if (!userPlaylist)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.danger)
					.setTitle(`:x: No playlist with that name found!`)
					.setDescription(
						"Create the playlist first with `/playlist create " +
							playlist +
							"` command and then add your songs!"
					),
			],
			ephemeral: true,
		});

	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.green)
				.setAuthor({ name: "Add new song to playlist" })
				.setTitle(`${song.title} added to the **${playlist}** playlist`)
				.setDescription(
					"Song added successfully.\nType `/music playlist " + playlist + "` to play your playlist."
				),
		],
		ephemeral: true,
	});
};

const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const { colors } = require("../../../../config.json");

const snipe = require("../../../schemas/UsersPlaylistsSchema");

module.exports = async (client, interaction) => {
	const queue = await client.player.createQueue(interaction.guild);

	if (!queue.connection) await queue.connect(interaction.member.voice.channel);

	//const playlistQuery = await interaction.options.getString("playlist");

	const playlistQuery = interaction.options.getString("playlist")
		? interaction.options.getString("playlist")
		: `${interaction.user.username}-playlist`;

	const playlist = await snipe.findOne({ userId: interaction.user.id, playlistName: playlistQuery });

	if (playlist.playlist.length == 0)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.danger)
					.setTitle(":x: This playlist don't have songs!")
					.setDescription(
						"You can add songs to this playlist with the following command: `/playlist add <song> " +
							playlistQuery +
							"`\nAdd songs and try again!"
					),
			],
			ephemeral: true,
		});

	const songs = [];
	let totalDuration = 0;
	for (const song of playlist.playlist) {
		const result = await client.player.search(song.url, {
			requestedBy: interaction.user,
			searchEngine: QueryType.YOUTUBE_VIDEO,
		});

		totalDuration += parseFloat(result.tracks[0].duration);
		songs.push(result.tracks[0]);
	}

	await queue.addTracks(songs);
	if (!queue.playing) await queue.play();

	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.success)
				.setAuthor({ name: "Add to the queue" })
				.setTitle(`The ${playlistQuery} playlist`)
				.setThumbnail(interaction.user.avatarURL())
				.setFields({ name: "Duration", value: `${totalDuration}min aprox`, inline: true })
				.setFooter({ text: `${songs.length} songs add.` }),
		],
	});
	/*const results = await client.player.search(playlistUrl, {
		requestedBy: interaction.user,
		searchEngine: QueryType.YOUTUBE_PLAYLIST,
	});

	 if (results.tracks.length == 0)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.danger)
					.setTitle(":x: No songs found!")
					.setDescription("Verify if the provides URL are correctly or try with other playlist."),
			],
			ephemeral: true,
		});

	const playlist = results.playlist;
	await queue.addTracks(results.tracks);

	if (!queue.playing) await queue.play();

	let totalDuration = 0;
	for (const track of playlist.tracks) {
		totalDuration += parseFloat(track.duration);
	}

	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.success)
				.setAuthor({ name: "Add to the queue" })
				.setTitle(`The ${playlist.title} playlist`)
				.setURL(playlist.url)
				.setThumbnail(playlist.thumbnail.url)
				.setFields({ name: "Duration", value: `${totalDuration}min aprox`, inline: true })
				.setFooter({ text: `${results.tracks.length} songs add.` }),
		],
	}); */
};

import { QueryType } from 'discord-player';
import { EmbedBuilder } from 'discord.js';
import config from '../../../app.config';

export default async (client, interaction, UsersPlaylists) => {
	const songToAdd = interaction.options.getString('song');
	const playlist = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	//Check if the song is a Youtube URL
	const urlSong = new URL(songToAdd);
	//If the host is not youtube generate a error
	if (urlSong.hostname !== 'www.youtube.com')
		throw new Error('not-youtube-url');

	const result = await client.player.search(songToAdd, {
		requestedBy: interaction.user,
		searchEngine: QueryType.YOUTUBE_VIDEO
	});
	const song = result.tracks[0];

	const userPlaylist = await UsersPlaylists.findOneAndUpdate(
		{ userId: interaction.user.id, playlistName: playlist },
		{ $push: { playlist: { id: song.id, title: song.title, url: song.url } } }
	);

	if (!userPlaylist) throw new Error('no-playlist-exist');

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.green)
				.setAuthor({ name: 'Add new song to playlist' })
				.setTitle(`${song.title} added to the **${playlist}** playlist`)
				.setDescription(
					`Song added successfully.\nType \`/music playlist ${playlist}\` to play your playlist.`
				)
		],
		ephemeral: true
	});
};

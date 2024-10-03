import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import PlaylistError from '@/errors/PlaylistError';
import Playlist from '@/models/Playlist';
import { searchTrack } from '@/utils/musicUtils';

const removePlaylistCommand = async (
	interaction: ChatInputCommandInteraction
) => {
	const songIndex = parseInt(interaction.options.getString('song') as string);
	const playlistName =
		interaction.options.getString('playlist') ??
		`${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	if (songIndex <= 0) {
		throw new PlaylistError(
			'Invalid song to remove',
			'Please enter a valid number song.'
		);
	}

	const playlist = await Playlist.findOne({
		user: interaction.user.id,
		name: playlistName
	});

	if (!playlist) {
		throw new PlaylistError(
			'The song you have indicated does not exist in the playlist',
			'Please check the song and try again.'
		);
	}

	if (playlist.tracks.length <= songIndex - 1) {
		throw new PlaylistError(
			'Invalid song index',
			'Please enter a valid song index.'
		);
	}

	const searchResult = await searchTrack(playlist.tracks[songIndex]);
	const firstTrackSearchResult = searchResult.tracks[0];

	playlist.tracks = playlist.tracks.splice(songIndex);
	await playlist.save();

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.green)
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.displayAvatarURL()
				})
				.setDescription(
					`
          **${playlistName} playlist**
          **[${firstTrackSearchResult.title}](${firstTrackSearchResult.url})** removed from the playlist.
          Type \`/play-playlist ${playlistName}\` to play your playlist.`
				)
		],
		ephemeral: true
	});
};

export default removePlaylistCommand;

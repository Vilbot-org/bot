import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import PlaylistError from '@/errors/PlaylistError';
import Playlist from '@/models/Playlist';

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

	playlist.tracks = playlist.tracks.splice(songIndex);
	await playlist.save();

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.green)
				.setAuthor({ name: 'Remove song to playlist' })
				.setTitle(
					`The song has been success removed to the **${playlistName}** playlist`
				)
		],
		ephemeral: true
	});
};

export default removePlaylistCommand;

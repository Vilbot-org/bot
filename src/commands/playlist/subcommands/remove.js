import { EmbedBuilder } from 'discord.js';

import PlaylistError from '../../../errors/PlaylistError';
import UserPlaylistModel from '../../../models/UserPlaylistModel';

import config from '../../../app.config';

export default async (interaction) => {
	const songToRemove = interaction.options.getString('song');
	const playlist = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	//Check if the number is valid
	if (songToRemove <= 0)
		throw new PlaylistError(
			'Invalid song to remove',
			'Please enter a valid number song.'
		);

	const userPlaylist = await UserPlaylistModel.findOneAndUpdate(
		{
			userId: interaction.user.id,
			playlistName: playlist,
			'playlist.id': songToRemove
		},
		{ $pull: { playlist: { id: songToRemove } } },
		{ multi: true }
	);

	if (!userPlaylist)
		throw new PlaylistError(
			'The song you have indicated does not exist in the playlist',
			'Please check the song and try again.'
		);

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.green)
				.setAuthor({ name: 'Remove song to playlist' })
				.setTitle(
					`The song has been success removed to the **${playlist}** playlist`
				)
		],
		ephemeral: true
	});
};

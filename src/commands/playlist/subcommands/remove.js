import { EmbedBuilder } from 'discord.js';

import UserPlaylistModel from '../../../models/UserPlaylistModel';
import DeferErrors from '../../../errors/DeferErrors';

import config from '../../../app.config';

export default async (interaction) => {
	const songToRemove = interaction.options.getString('song');
	const playlist = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	//Check if the number is valid
	if (songToRemove <= 0) throw new DeferErrors('invalid-song-id');

	const userPlaylist = await UserPlaylistModel.findOneAndUpdate(
		{
			userId: interaction.user.id,
			playlistName: playlist,
			'playlist.id': songToRemove
		},
		{ $pull: { playlist: { id: songToRemove } } },
		{ multi: true }
	);

	if (!userPlaylist) throw new DeferErrors('song-no-found-playlist');

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

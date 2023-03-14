import { EmbedBuilder } from 'discord.js';

import config from '../../../app.config';

export default async (client, interaction, snipe) => {
	const songToRemove = interaction.options.getString('song');
	const playlist = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	//Check if the number is valid
	if (songToRemove <= 0) throw new Error('invalid-song-id');

	const userPlaylist = await snipe.findOneAndUpdate(
		{
			userId: interaction.user.id,
			playlistName: playlist,
			'playlist.id': songToRemove
		},
		{ $pull: { playlist: { id: songToRemove } } },
		{ multi: true }
	);

	if (!userPlaylist) throw new Error('song-no-found-playlist');

	await interaction.reply({
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

import { EmbedBuilder } from 'discord.js';

import PlaylistError from '../../../errors/PlaylistError';
import UserPlaylistModel from '../../../models/UserPlaylistModel';

import config from '../../../app.config';

export default async (interaction) => {
	await interaction.deferReply({ ephemeral: true });

	const playlists = await UserPlaylistModel.find({
		userId: interaction.user.id
	});

	if (playlists.length === 0)
		throw new PlaylistError(
			"You still don't have playlists",
			'Type `/playlist create <playlist-name>` to create a new playlist.'
		);

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.info)
				.setAuthor({ name: 'List of playlist' })
				.setTitle(`${interaction.user.username} playlists:`)
				.setThumbnail(interaction.user.avatarURL())
				.setFooter({
					text: 'Type `/music playlist <playlist-name>` to listen to a playlist!'
				})
				.addFields(
					playlists.map((playlist) => ({
						name: `- ${playlist.playlistName}`,
						value:
							playlist.playlist.length === 0
								? 'Empty playlist'
								: `${playlist.playlist.length} song`
					}))
				)
		],
		ephemeral: true
	});
};

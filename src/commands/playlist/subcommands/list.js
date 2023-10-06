import { EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import PlaylistError from '@/errors/PlaylistError';
import Playlist from '@/models/Playlist';

export default async (interaction) => {
	await interaction.deferReply({ ephemeral: true });

	const playlists = await Playlist.find({
		user: interaction.user.id
	});

	if (playlists.length === 0) {
		throw new PlaylistError(
			'You still dont have playlists',
			'Type `/playlist create <playlist-name>` to create a new playlist.'
		);
	}

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
						name: `- ${playlist.name}`,
						value:
							playlist.songs.length === 0
								? 'Empty playlist'
								: `${playlist.songs.length} song`
					}))
				)
		],
		ephemeral: true
	});
};

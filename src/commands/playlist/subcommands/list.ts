import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import PlaylistError from '@/errors/PlaylistError';
import Playlist from '@/models/Playlist';

const listPlaylistSubCommand = async (
	interaction: ChatInputCommandInteraction
) => {
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
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.displayAvatarURL()
				})
				.setTitle('Your playlists:')
				.addFields(
					playlists.map((playlist) => ({
						name: `- ${playlist.name}`,
						value:
							playlist.tracks.length === 0
								? 'Empty playlist'
								: `${playlist.tracks.length} tracks`
					}))
				)
				.setFooter({
					text: 'Type `/play-playlist [playlist-name]` to play a playlist!'
				})
		],
		ephemeral: true
	});
};

export default listPlaylistSubCommand;

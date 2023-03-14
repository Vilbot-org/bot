import { EmbedBuilder } from 'discord.js';

import config from '../../../app.config';

export default async (client, interaction, UsersPlaylists) => {
	const playlists = await UsersPlaylists.find({ userId: interaction.user.id });

	if (playlists.length === 0) throw new Error('dont-have-playlist');

	return interaction.reply({
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

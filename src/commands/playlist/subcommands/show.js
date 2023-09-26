import { EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import PlaylistError from '@/errors/PlaylistError';
import Playlist from '@/models/Playlist';

export default async (interaction) => {
	const playlistName = interaction.options.getString('name')
		? interaction.options.getString('name')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	const playlist = await Playlist.findOne({
		user: interaction.user.id,
		name: playlistName
	});
	if (!playlist)
		throw new PlaylistError(
			"You don't have any playlist with this name",
			'Please check the name with the command `/playlist list` and try again'
		);

	const embedMsg = new EmbedBuilder()
		.setColor(config.colors.success)
		.setAuthor({ name: 'Songs list' })
		.setTitle(playlist.name);

	if (playlist.songs.length > 0) {
		embedMsg.addFields(
			playlist.songs.map((song, index) => ({
				name: `ID: ${index + 1}`,
				value: song
				//value: `[${playlist.title}](${playlist.url})`
			}))
		);
	}

	await interaction.followUp({
		embeds: [
			embedMsg
				.setDescription(`This playlist have ${playlist.songs.length} songs`)
				.setFooter({
					text:
						playlist.songs.length > 0
							? `Type \`/music playlist ${playlist.name}\` to play your playlist.`
							: `Type \`/playlist add <song> ${playlist.name}\` to add new songs to  your playlist.`
				})
		],
		ephemeral: true
	});
};

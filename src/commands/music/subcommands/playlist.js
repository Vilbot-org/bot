import { EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import MusicErrors from '@/errors/MusicErrors';
import Playlist from '@/models/Playlist';
import { playPlaylist } from '@/functions/musicUtils';

export default async (interaction) => {
	const { channel } = interaction.member.voice;
	const playlistQuery = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	const playlist = await Playlist.findOne({
		user: interaction.user.id,
		name: playlistQuery
	});
	if (!playlist) {
		throw new MusicErrors(
			'This playlist dont exist!',
			'Use `/playlist create <playlist>` to create a playlist.'
		);
	}

	if (playlist.songs.length === 0) {
		throw new MusicErrors(
			'This playlist dont have songs!',
			`You can add songs to this playlist with the following command: \`/playlist add <song> ${playlist.playlistName}\`.`
		);
	}

	await playPlaylist(playlist.songs, interaction.guildId, channel.id);

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setAuthor({ name: 'Add to the queue' })
				.setTitle(`The ${playlistQuery} playlist`)
				.setThumbnail(interaction.user.avatarURL())
				.setFooter({ text: `${playlist.songs.length} songs added.` })
		]
	});
};

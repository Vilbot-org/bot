import { useMasterPlayer as player } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import MusicErrors from '@/errors/MusicErrors';
import Playlist from '@/models/Playlist';

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

	const { queue } = await player().play(channel, playlist.songs[0], {
		nodeOptions: {
			metadata: interaction,
			volume: 40
		}
	});

	if (playlist.songs.length > 1) {
		playlist.songs.forEach(async (song, index) => {
			if (index > 0) {
				const searchResult = await player().search(song, {
					requestedBy: interaction.user
				});

				queue.insertTrack(searchResult.tracks[0], queue.getSize());
			}
		});
	}

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

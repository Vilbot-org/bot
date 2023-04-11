import { useMasterPlayer as player } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

import MusicErrors from '../../../errors/MusicErrors';
import UserPlaylistModel from '../../../models/UserPlaylistModel';

import config from '../../../app.config';

export default async (interaction) => {
	const { channel } = interaction.member.voice;
	const playlistQuery = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	let playlist = await UserPlaylistModel.findOne({
		userId: interaction.user.id,
		playlistName: playlistQuery
	});
	if (!playlist)
		throw new MusicErrors(
			"This playlist don't exist!",
			'Use `/playlist create <playlist>` to create a playlist.'
		);

	playlist = playlist.playlist;

	if (playlist.length === 0)
		throw new MusicErrors(
			"This playlist don't have songs!",
			`You can add songs to this playlist with the following command: \`/playlist add <song> ${playlist.playlistName}\`.`
		);

	const getSearchResults = async (track) => {
		const searchResult = await player().search(track.title);
		return searchResult.tracks[0];
	};

	const tracks = await Promise.all(
		playlist.map(async (track) => {
			return getSearchResults(track);
		})
	);

	const { queue } = await player().play(channel, tracks[0], {
		nodeOptions: {
			metadata: interaction,
			volume: 40
		}
	});

	if (tracks.length > 1)
		tracks.forEach((track) => {
			queue.insertTrack(track, queue.getSize());
		});

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setAuthor({ name: 'Add to the queue' })
				.setTitle(`The ${playlistQuery} playlist`)
				.setThumbnail(interaction.user.avatarURL())
				.setFooter({ text: `${playlist.length} songs added.` })
		]
	});
};

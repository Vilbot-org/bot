import { EmbedBuilder } from 'discord.js';

import UserPlaylistModel from '../../../models/UserPlaylistModel';

import DeferErrors from '../../../errors/DeferErrors';

import config from '../../../app.config';

export default async (client, interaction) => {
	const { channel } = interaction.member.voice;
	const playlistQuery = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	let playlist = await UserPlaylistModel.findOne({
		userId: interaction.user.id,
		playlistName: playlistQuery
	});
	if (!playlist) throw new DeferErrors('playlist-dont-exist');

	playlist = playlist.playlist;

	if (playlist.length === 0) throw new DeferErrors('playlist-no-songs');

	const getSearchResults = async (track) => {
		const searchResult = await client.player.search(track.title);
		return searchResult.tracks[0];
	};

	const tracks = await Promise.all(
		playlist.map(async (track) => {
			return getSearchResults(track);
		})
	);

	const { queue } = await client.player.play(channel, tracks[0], {
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

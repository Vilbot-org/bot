import { EmbedBuilder } from 'discord.js';

import UserPlaylistModel from '../../../models/UserPlaylistModel';

import config from '../../../app.config';

export default async (client, interaction) => {
	const { channel } = interaction.member.voice;
	const playlistQuery = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply();

	try {
		let playlist = await UserPlaylistModel.findOne({
			userId: interaction.user.id,
			playlistName: playlistQuery
		});
		if (!playlist)
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.danger)
						.setTitle(":x: This playlist don't exist!")
				],
				ephemeral: true
			});

		playlist = playlist.playlist;

		if (playlist.length === 0)
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.danger)
						.setTitle(":x: This playlist don't have songs!")
						.setDescription(
							`You can add songs to this playlist with the following command: \`/playlist add <song> ${playlistQuery}\`\nAdd songs and try again!`
						)
				],
				ephemeral: true
			});

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

		return interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.success)
					.setAuthor({ name: 'Add to the queue' })
					.setTitle(`The ${playlistQuery} playlist`)
					.setThumbnail(interaction.user.avatarURL())
					.setFooter({ text: `${playlist.length} songs added.` })
			]
		});
	} catch (e) {
		return interaction.followUp(`Something went wrong: ${e}`);
	}
};

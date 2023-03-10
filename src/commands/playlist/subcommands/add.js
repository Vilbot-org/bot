import { EmbedBuilder } from 'discord.js';

import UserPlaylistModel from '../../../models/UserPlaylistModel';

import config from '../../../app.config';

export default async (client, interaction) => {
	const songToAdd = interaction.options.getString('song');
	const playlist = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply();

	try {
		const searchResult = (await client.player.search(songToAdd)).tracks;
		if (searchResult.length === 0)
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.danger)
						.setDescription(':x: Song not found, try another name or URL!')
				],
				ephemeral: true
			});

		const track = searchResult[0];

		const userPlaylist = await UserPlaylistModel.findOneAndUpdate(
			{ userId: interaction.user.id, playlistName: playlist },
			{
				$push: {
					playlist: {
						id: track.id,
						title: track.title
					}
				}
			}
		);

		if (!userPlaylist)
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.danger)
						.setTitle(`:x: No playlist with that name found!`)
						.setDescription(
							`Create the playlist first with \`/playlist create ${playlist}\` command and then add your songs!`
						)
				],
				ephemeral: true
			});

		return interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.green)
					.setAuthor({ name: 'Added new song to playlist' })
					.setTitle(`'${track.title}' added to the **${playlist}** playlist`)
					.setDescription(
						`Song added successfully.\nType \`/music playlist ${playlist}\` to play your playlist.`
					)
			],
			ephemeral: true
		});
	} catch (e) {
		return interaction.followUp(`Something went wrong: ${e}`);
	}
};

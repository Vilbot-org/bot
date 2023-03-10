import { EmbedBuilder } from 'discord.js';

import UserPlaylistModel from '../../../models/UserPlaylistModel';

import config from '../../../app.config';

export default async (client, interaction) => {
	const songToRemove = interaction.options.getString('song');
	const playlist = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply();

	try {
		//Check if the number is valid
		if (songToRemove <= 0) {
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.danger)
						.setTitle(':x: Please enter a valit number song.')
				],
				ephemeral: true
			});
		}

		const userPlaylist = await UserPlaylistModel.findOneAndUpdate(
			{
				userId: interaction.user.id,
				playlistName: playlist,
				'playlist.id': songToRemove
			},
			{ $pull: { playlist: { id: songToRemove } } },
			{ multi: true }
		);

		if (!userPlaylist)
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.danger)
						.setTitle(
							`:x: The song you have indicated does not exist in the playlist!`
						)
						.setDescription('Please check the song and try again.')
				],
				ephemeral: true
			});

		return interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.green)
					.setAuthor({ name: 'Remove song to playlist' })
					.setTitle(
						`The song has been success removed to the **${playlist}** playlist`
					)
			],
			ephemeral: true
		});
	} catch (e) {
		return interaction.followUp(`Something went wrong: ${e}`);
	}
};

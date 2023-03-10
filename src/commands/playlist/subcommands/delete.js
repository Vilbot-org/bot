import { EmbedBuilder } from 'discord.js';

import UserPlaylistModel from '../../../models/UserPlaylistModel';

import config from '../../../app.config';

export default async (client, interaction) => {
	const playlistName = interaction.options.getString('name');

	await interaction.deferReply();

	try {
		const deletePlaylist = await UserPlaylistModel.findOneAndDelete({
			userId: interaction.user.id,
			playlistName
		});

		//Check if  exist this playlist
		if (deletePlaylist)
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.green)
						.setAuthor({ name: 'Delete the playlist' })
						.setTitle(
							`A playlist '${playlistName}' has been deleted sucessfully!`
						)
						.setFooter({ text: 'Type `/playlist help` to display more info' })
				],
				ephemeral: true
			});

		return interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.danger)
					.setAuthor({ name: 'Error' })
					.setTitle("You don't have any playlist with this name!")
					.setDescription(
						'Please check the name with the command `/playlist list` and try again'
					)
					.setFooter({ text: 'Type `/playlist help` to display more info' })
			],
			ephemeral: true
		});
	} catch (e) {
		return interaction.followUp(`Something went wrong: ${e}`);
	}
};

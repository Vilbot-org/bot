import { EmbedBuilder } from 'discord.js';

import UserPlaylistModel from '../../../models/UserPlaylistModel';

import config from '../../../app.config';

export default async (client, interaction) => {
	const playlistName = interaction.options.getString('name')
		? interaction.options.getString('name')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply();

	try {
		//Check if this playlist already exist
		const playlist = await UserPlaylistModel.findOne({
			userId: interaction.user.id,
			playlistName
		});
		if (playlist)
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.danger)
						.setTitle(
							interaction.options.getString('name')
								? ':x: A playlist with that name already exists!'
								: ':x: You already have your default playlist created'
						)
				],
				ephemeral: true
			});

		//Create new playlist if the user don't have a playlist with that name
		const newPlaylist = new UserPlaylistModel({
			userId: interaction.user.id,
			playlistName
		});

		try {
			await newPlaylist.save();

			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.green)
						.setAuthor({ name: 'Create a new playlist' })
						.setTitle(
							`A playlist '${playlistName}' has been created sucessfully!`
						)
						.setDescription(
							`Now you can add new song in your playlist with the command: \`/playlist add [song] ${playlistName}\`.`
						)
						.setFooter({ text: 'Type `/playlist help` to display more info' })
				],
				ephemeral: true
			});
		} catch (e) {
			return interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.danger)
						.setAuthor({ name: 'Error!' })
						.setTitle(':x: An error occurred while creating your playlist')
						.setDescription('Please wait a moment and try again.')
				],
				ephemeral: true
			});
		}
	} catch (e) {
		return interaction.followUp(`Something went wrong: ${e}`);
	}
};

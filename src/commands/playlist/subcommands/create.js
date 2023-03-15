import { EmbedBuilder } from 'discord.js';

import UserPlaylistModel from '../../../models/UserPlaylistModel';
import DeferErrors from '../../../errors/DeferErrors';

import config from '../../../app.config';

export default async (interaction) => {
	const playlistName = interaction.options.getString('name')
		? interaction.options.getString('name')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	//Check if this playlist already exist
	const playlist = await UserPlaylistModel.findOne({
		userId: interaction.user.id,
		playlistName
	});
	if (playlist) throw new DeferErrors('playlist-already-exist');

	//Create new playlist if the user don't have a playlist with that name
	const newPlaylist = new UserPlaylistModel({
		userId: interaction.user.id,
		playlistName
	});

	await newPlaylist.save();

	return interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.green)
				.setAuthor({ name: 'Create a new playlist' })
				.setTitle(`A playlist '${playlistName}' has been created sucessfully!`)
				.setDescription(
					`Now you can add new song in your playlist with the command: \`/playlist add [song] ${playlistName}\`.`
				)
				.setFooter({ text: 'Type `/playlist help` to display more info' })
		],
		ephemeral: true
	});
};

import { EmbedBuilder } from 'discord.js';

import UserPlaylistModel from '../../../models/UserPlaylistModel';

import config from '../../../app.config';
import PlaylistError from '../../../errors/PlaylistError';

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
	if (playlist)
		throw new PlaylistError(
			playlistName === `${interaction.user.username}-playlist`
				? 'You already have your default playlist created'
				: 'A playlist with that name already exists',
			`Create a new playlist or add songs to the exist playlist with \`playlist add ${playlist.playlistName}\`!`
		);

	//Create new playlist if the user don't have a playlist with that name
	const newPlaylist = new UserPlaylistModel({
		userId: interaction.user.id,
		playlistName
	});

	await newPlaylist.save();

	await interaction.followUp({
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

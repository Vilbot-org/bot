import { EmbedBuilder } from 'discord.js';

import config from '../../../app.config';

export default async (client, interaction, UsersPlaylists) => {
	const playlistName = interaction.options.getString('name')
		? interaction.options.getString('name')
		: `${interaction.user.username}-playlist`;

	//Check if this playlist already exist
	const data = await UsersPlaylists.findOne({
		userId: interaction.user.id,
		playlistName
	});
	if (data) throw new Error('playlist-already-exist');

	//Create new playlist if the user don't have a playlist with that name
	const newPlaylist = new UsersPlaylists({
		userId: interaction.user.id,
		playlistName,
		public: true,
		playlist: []
	});
	await newPlaylist.save();

	await interaction.reply({
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

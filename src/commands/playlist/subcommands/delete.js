import { EmbedBuilder } from 'discord.js';

import config from '../../../app.config';

export default async (client, interaction, UsersPlaylists) => {
	const playlistName = interaction.options.getString('name');

	//If you try to delete the default playlist
	if (playlistName === `${interaction.user.username}-playlist`) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.danger)
					.setTitle(":x: You can't delete the default playlist!")
					.setDescription('Please try with another playlist.')
			],
			ephemeral: true
		});
		return;
	}

	const deletePlaylist = await UsersPlaylists.findOneAndDelete({
		userId: interaction.user.id,
		playlistName
	});

	//Check if  exist this playlist
	if (!deletePlaylist) throw new Error('no-playlist-to-delete');

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.green)
				.setAuthor({ name: 'Delete the playlist' })
				.setTitle(`A playlist '${playlistName}' has been deleted sucessfully!`)
				.setFooter({ text: 'Type `/playlist help` to display more info' })
		],
		ephemeral: true
	});
};

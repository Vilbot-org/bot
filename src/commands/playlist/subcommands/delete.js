import { EmbedBuilder } from 'discord.js';

import UserPlaylistModel from '../../../models/UserPlaylistModel';
import DeferErrors from '../../../errors/DeferErrors';

import config from '../../../app.config';

export default async (client, interaction) => {
	const playlistName = interaction.options.getString('name');

	await interaction.deferReply({ ephemeral: true });

	const deletePlaylist = await UserPlaylistModel.findOneAndDelete({
		userId: interaction.user.id,
		playlistName
	});

	if (!deletePlaylist) throw new DeferErrors('no-playlist-to-delete');

	//Check if  exist this playlist
	await interaction.followUp({
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

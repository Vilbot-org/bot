import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import PlaylistError from '@/errors/PlaylistError';
import Playlist from '@/models/Playlist';

const deletePlaylistSubCommand = async (
	interaction: ChatInputCommandInteraction
) => {
	const playlistName = interaction.options.getString('name') as string;

	await interaction.deferReply({ ephemeral: true });

	const deletedPlaylist = await Playlist.findOneAndDelete({
		user: interaction.user.id,
		name: playlistName
	});

	if (!deletedPlaylist) {
		throw new PlaylistError(
			'You dont have any playlist with this name',
			'Please check the name with the command `/playlist list` and try again'
		);
	}

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

export default deletePlaylistSubCommand;

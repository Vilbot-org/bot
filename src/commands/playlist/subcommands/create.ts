import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import Playlist from '@/models/Playlist';
import PlaylistError from '@/errors/PlaylistError';

const playlistCreateSubCommand = async (
	interaction: ChatInputCommandInteraction
) => {
	const playlistName =
		interaction.options.getString('name') ??
		`${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	const playlist = await Playlist.findOne({
		user: interaction.user.id,
		name: playlistName
	});

	if (playlist) {
		throw new PlaylistError(
			playlistName === `${interaction.user.username}-playlist`
				? 'You already have your default playlist created'
				: 'A playlist with that name already exists',
			`Create a new playlist or add songs to the exist playlist with \`playlist add ${playlist.name}\`!`
		);
	}

	const newPlaylist = new Playlist({
		user: interaction.user.id,
		name: playlistName
	});

	await newPlaylist.save();

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.green)
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.displayAvatarURL()
				})
				.setDescription(
					`
          **${playlistName} playlist**
          A playlist has been created sucessfully!
          Now you can add new song in your playlist with the command: \`/playlist add <song> ${playlistName}\`.`
				)
		]
	});
};

export default playlistCreateSubCommand;

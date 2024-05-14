import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import PlaylistError from '@/errors/PlaylistError';
import Playlist from '@/models/Playlist';
import { searchTrack } from '@/utils/musicUtils';

const showPlaylistSubCommand = async (
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

	if (!playlist) {
		throw new PlaylistError(
			'You dont have any playlist with this name',
			'Please check the name with the command `/playlist list` and try again'
		);
	}

	const embedMsg = new EmbedBuilder()
		.setColor(config.colors.success)
		.setAuthor({ name: 'Songs list' })
		.setTitle(playlist.name);

	if (playlist.tracks.length > 0) {
		const fields = await Promise.all(
			playlist.tracks.map(async (track, index) => {
				const searchResult = await searchTrack(track);
				const { title, url } = searchResult.tracks[0];

				return {
					name: `ID: ${index + 1}`,
					value: `[${title}](${url})`
				};
			})
		);

		embedMsg.addFields(fields);
	}

	await interaction.followUp({
		embeds: [
			embedMsg
				.setDescription(`This playlist have ${playlist.tracks.length} songs`)
				.setFooter({
					text:
						playlist.tracks.length > 0
							? `Type \`/music playlist ${playlist.name}\` to play your playlist.`
							: `Type \`/playlist add <song> ${playlist.name}\` to add new songs to  your playlist.`
				})
		],
		ephemeral: true
	});
};

export default showPlaylistSubCommand;

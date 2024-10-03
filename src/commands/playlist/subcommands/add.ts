import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import PlaylistError from '@/errors/PlaylistError';
import Playlist from '@/models/Playlist';
import { searchTrack } from '@/utils/musicUtils';

const addPlaylistSubCommand = async (
	interaction: ChatInputCommandInteraction
) => {
	const songToAdd = interaction.options.getString('song') as string;
	const playlistName =
		interaction.options.getString('playlist') ??
		`${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	const searchResult = await searchTrack(songToAdd);
	const firstTrackSearchResult = searchResult.tracks[0];

	const userPlaylist = await Playlist.findOneAndUpdate(
		{ user: interaction.user.id, name: playlistName },
		{
			$push: {
				tracks: firstTrackSearchResult.url
			}
		}
	);

	if (!userPlaylist) {
		throw new PlaylistError(
			'No playlist with that name found',
			`Create the playlist first with \`/playlist create ${playlistName}\` command and then add your songs!`
		);
	}

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.green)
				.setThumbnail(firstTrackSearchResult.thumbnail ?? null)
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.displayAvatarURL()
				})
				.setDescription(
					`
          **${playlistName} playlist**
          **[${firstTrackSearchResult.title}](${firstTrackSearchResult.url})** added to the playlist.
          Type \`/play-playlist ${playlistName}\` to play your playlist.`
				)
		]
	});
};

export default addPlaylistSubCommand;

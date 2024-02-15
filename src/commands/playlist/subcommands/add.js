import { useMasterPlayer as player } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import PlaylistError from '@/errors/PlaylistError';
import Playlist from '@/models/Playlist';

export default async (interaction) => {
	const songToAdd = interaction.options.getString('song');
	const playlistName = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	const { tracks } = await player().search(songToAdd);
	if (tracks.length === 0) {
		throw new PlaylistError(
			'Song not found',
			'Try another specific name or Youtube URL.'
		);
	}

	const track = tracks[0];

	const userPlaylist = await Playlist.findOneAndUpdate(
		{ user: interaction.user.id, name: playlistName },
		{
			$push: {
				songs: track.url
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
				.setAuthor({ name: 'Added new song to playlist' })
				.setTitle(`'${track.title}' added to the **${playlistName}** playlist`)
				.setDescription(
					`Song added successfully.\nType \`/music playlist ${playlistName}\` to play your playlist.`
				)
		],
		ephemeral: true
	});
};

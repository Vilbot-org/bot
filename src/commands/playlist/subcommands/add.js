import { EmbedBuilder } from 'discord.js';

import UserPlaylistModel from '../../../models/UserPlaylistModel';
import DeferErrors from '../../../errors/DeferErrors';

import config from '../../../app.config';

export default async (client, interaction) => {
	const songToAdd = interaction.options.getString('song');
	const playlist = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	const { tracks } = await client.player.search(songToAdd);
	if (tracks.length === 0) throw new DeferErrors('search-song-not-found');

	const track = tracks[0];

	const userPlaylist = await UserPlaylistModel.findOneAndUpdate(
		{ userId: interaction.user.id, playlistName: playlist },
		{
			$push: {
				playlist: {
					id: track.id,
					title: track.title
				}
			}
		}
	);

	if (!userPlaylist) throw new DeferErrors('no-playlist-exist');

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.green)
				.setAuthor({ name: 'Added new song to playlist' })
				.setTitle(`'${track.title}' added to the **${playlist}** playlist`)
				.setDescription(
					`Song added successfully.\nType \`/music playlist ${playlist}\` to play your playlist.`
				)
		],
		ephemeral: true
	});
};

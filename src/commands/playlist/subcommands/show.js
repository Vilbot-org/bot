import { EmbedBuilder } from 'discord.js';

import UserPlaylistModel from '../../../models/UserPlaylistModel';
import DeferErrors from '../../../errors/DeferErrors';

import config from '../../../app.config';

export default async (client, interaction) => {
	const playlistName = interaction.options.getString('name')
		? interaction.options.getString('name')
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply({ ephemeral: true });

	//Check if this playlist already exist
	const data = await UserPlaylistModel.findOne({
		userId: interaction.user.id,
		playlistName
	});
	if (!data) throw new DeferErrors('no-playlist-exist');

	const embedMsg = new EmbedBuilder()
		.setColor(config.colors.success)
		.setAuthor({ name: 'Songs list' })
		.setTitle(data.playlistName);

	if (data.playlist.length > 0) {
		embedMsg.addFields(
			data.playlist.map((playlist) => ({
				name: `ID: ${playlist.id}`,
				value: `[${playlist.title}](${playlist.url})`
			}))
		);
	}

	await interaction.followUp({
		embeds: [
			embedMsg
				.setDescription(`This playlist have ${data.playlist.length} songs`)
				.setFooter({
					text:
						data.playlist.length > 0
							? `Type \`/music playlist ${playlistName}\` to play your playlist.`
							: `Type \`/playlist add <song> ${playlistName}\` to add new songs to  your playlist.`
				})
		],
		ephemeral: true
	});
};

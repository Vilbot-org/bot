import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import config from '@/app.config';
import MusicErrors from '@/errors/MusicErrors';
import { playPlaylist } from '@/functions/musicUtils';
import Playlist from '@/models/Playlist';

export default {
	data: new SlashCommandBuilder()
		.setName('play-playlist')
		.setDescription('Play a playlist in the voice channel!')
		.addStringOption((option) =>
			option
				.setName('playlist')
				.setDescription('Enter the name of your playlist.')
				.setRequired(true)
				.setAutocomplete(true)
		),

	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);

		if (focusedOption.name === 'playlist' && focusedOption.value !== '') {
			const playlistResult = await Playlist.find({
				name: { $regex: new RegExp(focusedOption.value, 'i') },
				user: interaction.user.id
			});

			if (playlistResult.length > 0) {
				await interaction.respond(
					playlistResult.slice(0, 4).map((playlist) => ({
						name: playlist.name,
						value: playlist.name
					}))
				);
			}
		}
	},

	async execute(interaction) {
		const { channel } = interaction.member.voice;
		const playlistQuery = interaction.options.getString('playlist')
			? interaction.options.getString('playlist')
			: `${interaction.user.username}-playlist`;

		await interaction.deferReply({ ephemeral: true });

		const playlist = await Playlist.findOne({
			user: interaction.user.id,
			name: playlistQuery
		});
		if (!playlist) {
			throw new MusicErrors(
				'This playlist dont exist!',
				'Use `/playlist create <playlist>` to create a playlist.'
			);
		}

		if (playlist.songs.length === 0) {
			throw new MusicErrors(
				'This playlist dont have songs!',
				`You can add songs to this playlist with the following command: \`/playlist add <song> ${playlist.playlistName}\`.`
			);
		}

		const voiceChannel = {
			guild: interaction.guildId,
			voice: channel?.id
		};
		await playPlaylist(playlist.songs, voiceChannel, interaction.user);

		await interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.success)
					.setAuthor({ name: 'Add to the queue' })
					.setTitle(`The ${playlistQuery} playlist`)
					.setThumbnail(interaction.user.avatarURL())
					.setFooter({ text: `${playlist.songs.length} songs added.` })
			]
		});
	}
};

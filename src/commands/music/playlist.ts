import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	EmbedBuilder
} from 'discord.js';

import config from '@/app.config';
import Playlist from '@/models/Playlist';
import Command from '@/classes/Command';
import { getVoiceChannel } from '@/utils/guildUtils';
import MusicError from '@/errors/MusicError';
import { playPlaylist } from '@/utils/musicUtils';
import { formatDurationQueueForEmbed } from '@/utils/interactions';
import { getEmoji } from '@/common/utils/EmojiHelper';

const autocomplete = async (interaction: AutocompleteInteraction) => {
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
};

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);
	const playlistQuery = interaction.options.getString('playlist')
		? interaction.options.getString('playlist')
		: `${interaction.user.username}-playlist`;

	const playlist = await Playlist.findOne({
		user: interaction.user.id,
		name: playlistQuery
	});
	if (!playlist) {
		await interaction.deferReply({ ephemeral: true });
		throw new MusicError(
			'This playlist dont exist!',
			'Use `/playlist create <playlist>` to create a playlist.'
		);
	}

	if (playlist.tracks.length === 0) {
		await interaction.deferReply({ ephemeral: true });
		throw new MusicError(
			'This playlist dont have songs!',
			`You can add songs to this playlist with the following command: \`/playlist add <song> ${playlist.name}\`.`
		);
	}

	await interaction.deferReply();
	const queue = await playPlaylist(
		playlist.tracks,
		voiceChannel,
		interaction.user.id
	);

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.displayAvatarURL()
				})
				.setThumbnail(queue.currentTrack?.thumbnail ?? null)
				.setDescription(
					`
          **Playing playlist**
          ${getEmoji('playing')} **${playlistQuery} playlist**
          `
				)
				.setFooter({
					text: `${
						playlist.tracks.length
					} songs added to the queue - Estimated duration: ${formatDurationQueueForEmbed(
						queue
					)}`
				})
		]
	});
};

const playlistMusicCommandOptions = {
	name: 'play-playlist',
	description: 'Play a playlist in the voice channel!',
	execute: execute,
	autocomplete: autocomplete
};
const playlistMusicCommand = new Command(playlistMusicCommandOptions);
playlistMusicCommand.addStringOption(
	'playlist',
	'Enter the name of your playlist.',
	true,
	true
);

export default playlistMusicCommand;

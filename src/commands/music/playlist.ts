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

	await interaction.deferReply({ ephemeral: true });

	const playlist = await Playlist.findOne({
		user: interaction.user.id,
		name: playlistQuery
	});
	if (!playlist) {
		throw new MusicError(
			'This playlist dont exist!',
			'Use `/playlist create <playlist>` to create a playlist.'
		);
	}

	if (playlist.tracks.length === 0) {
		throw new MusicError(
			'This playlist dont have songs!',
			`You can add songs to this playlist with the following command: \`/playlist add <song> ${playlist.name}\`.`
		);
	}

	await playPlaylist(playlist.tracks, voiceChannel);

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setAuthor({ name: 'Add to the queue' })
				.setTitle(`The ${playlistQuery} playlist`)
				.setThumbnail(interaction.user.avatarURL())
				.setFooter({ text: `${playlist.tracks.length} songs added.` })
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

import { useMainPlayer as player } from 'discord-player';
import {
	AutocompleteInteraction,
	ChatInputCommandInteraction
} from 'discord.js';

import Command from '@/classes/Command';
import { play } from '@/utils/musicUtils';
import { EmbedBuilder } from '@discordjs/builders';
import { getVoiceChannel } from '@/utils/guildUtils';

const autocomplete = async (interaction: AutocompleteInteraction) => {
	const focusedOption = interaction.options.getFocused(true);

	if (focusedOption.name === 'song' && focusedOption.value !== '') {
		const searchResult = await player().search(focusedOption.value);

		if (searchResult.hasTracks()) {
			const response = searchResult.tracks.slice(0, 4).map((track) => {
				let name = `${track.title} - ${track.author}`;
				if (name.length > 100) {
					name = `${name.substring(0, 97)}...`;
				}

				return {
					name,
					value: track.url
				};
			});

			await interaction.respond(response);
		}
	}
};

const execute = async (interaction: ChatInputCommandInteraction) => {
	const query = interaction.options.getString('song') as string;
	const voiceChannel = getVoiceChannel(interaction);

	await interaction.deferReply();

	const { queue, track } = await play(query, voiceChannel);

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(0x01feff)
				.setAuthor({ name: 'Add to the queue' })
				.setTitle(`${track.title}`)
				.setURL(`${track.url}`)
				.setThumbnail(`${track.thumbnail}`)
				.setFields(
					{ name: 'Duration', value: `${track.duration}`, inline: true },
					{
						name: 'Position in the queue',
						value: `${queue.getSize() > 0 ? queue.getSize() : 'Playing now'}`,
						inline: true
					}
				)
				.setFooter({
					text:
						queue.getSize() > 1
							? `Next song in the queue: ${queue.tracks.at(0)?.title}`
							: 'This is the first song in the queue.'
				})
		]
	});
};

const playCommandOptions = {
	name: 'play',
	description: 'Play a song in the voice channel!',
	execute: execute,
	autocomplete: autocomplete
};
const playCommand = new Command(playCommandOptions);

playCommand.addStringOption(
	'song',
	'Enter the name of the song  or the URL.',
	true,
	true
);

export default playCommand;

import { useMainPlayer as player } from 'discord-player';
import {
	AutocompleteInteraction,
	ChatInputCommandInteraction
} from 'discord.js';
import {
	EmbedBuilder,
	type EmbedFooterOptions,
	formatEmoji
} from '@discordjs/builders';

import Command from '@/classes/Command';
import { play } from '@/utils/musicUtils';
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

	const { queue, track } = await play(query, voiceChannel, interaction.user.id);

	const embedDescription = `
  **${queue.currentTrack === track ? 'Now playing' : 'Added to queue'}**
  ${formatEmoji(
		queue.currentTrack === track ? '1273955433299705877' : '1273961635840524332'
	)} **[${track.title}](${track.url})** **\`${track.duration}\`**`;

	let embedFooter: EmbedFooterOptions | null = null;
	if (queue.getSize() >= 1) {
		embedFooter = { text: `Queue position: ${queue.getSize()}` };
	}

	const embed = new EmbedBuilder()
		.setColor(0x01feff)
		.setAuthor({
			name: interaction.user.username,
			iconURL: interaction.user.displayAvatarURL()
		})
		.setDescription(embedDescription)
		.setThumbnail(track.thumbnail);

	if (embedFooter) {
		embed.setFooter(embedFooter);
	}

	await interaction.followUp({
		embeds: [embed]
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

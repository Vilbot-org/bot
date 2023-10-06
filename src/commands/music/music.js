import { SlashCommandBuilder } from 'discord.js';

import errorHandler from '@/handlers/errorHandler';

export default {
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('Command to control the music of the bot.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('play')
				.setDescription('Play a song in the voice channel!')
				.addStringOption((option) =>
					option
						.setName('song')
						.setDescription('Enter the name of the song  or the URL.')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('playlist')
				.setDescription('Play a playlist in the voice channel!')
				.addStringOption((option) =>
					option
						.setName('playlist')
						.setDescription('Enter the name of your playlist.')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('queue').setDescription('See the queue of the bot!')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('previous')
				.setDescription('Go back to the previous song!')
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('skip').setDescription('Skip the current song!')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('fskip')
				.setDescription('Force the skip (no votation).')
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('pause').setDescription('Pause the music!')
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('resume').setDescription('Resume the music!')
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('quit').setDescription('Disconnect the bot of music!')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('setup')
				.setDescription('Run this command to setup the bot!')
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('info').setDescription('Info about the current song!')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('help')
				.setDescription('See the main commands and aditional info!')
		),

	async execute(interaction) {
		const subCommand = interaction.options.getSubcommand();

		try {
			if (
				!interaction.member.voice.channel &&
				subCommand !== 'setup' &&
				subCommand !== 'clear' &&
				subCommand !== 'help'
			) {
				throw new Error(
					'You need to be in a voice channel',
					'Enter to any voice channel and try again.'
				);
			}

			const { default: subCommandFunction } = await import(
				`./subcommands/${subCommand}`
			);
			await subCommandFunction(interaction);
		} catch (e) {
			errorHandler(interaction, e);
		}
	}
};

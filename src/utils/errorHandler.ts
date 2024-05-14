import type { AutocompleteInteraction } from 'discord.js';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import type BotError from '@/errors/BotError';
import config from '../app.config';
import logger from './logger';

const errorHandler = async (
	interaction: ChatInputCommandInteraction | AutocompleteInteraction,
	error: BotError
) => {
	if (interaction instanceof ChatInputCommandInteraction) {
		const embedMessage = new EmbedBuilder()
			.setColor(config.colors.danger)
			.setAuthor({ name: error.name })
			.setTitle(`:x: ${error.title || 'Oops! Unexpected error'}!`)
			.setDescription(error.message || 'Wait a few seconds and try again.');

		logger.error(`[${error.name}] ${error.message}`);

		if (interaction.deferred || interaction.replied) {
			await interaction.followUp({
				embeds: [embedMessage],
				ephemeral: true
			});
		} else {
			await interaction.reply({
				embeds: [embedMessage],
				ephemeral: true
			});
		}
	}
};

export default errorHandler;

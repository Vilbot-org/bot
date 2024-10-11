import type { AutocompleteInteraction } from 'discord.js';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import type BotError from '@/errors/BotError';
import config from '../app.config';
import Logger from '@/common/services/Logger';

const errorHandler = async (
	interaction: ChatInputCommandInteraction | AutocompleteInteraction,
	error: BotError
) => {
	if (interaction instanceof ChatInputCommandInteraction) {
		Logger.error('errorGenerator', error.name, error.message);

		const embedMessage = new EmbedBuilder()
			.setColor(config.colors.danger)
			.setAuthor({ name: error.name })
			.setDescription(
				`
        :exclamation: **${error.title || 'Oops! Unexpected error'}**!
        ${error.message || 'Wait a few seconds and try again.'}
        `
			);

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

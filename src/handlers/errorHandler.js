import { EmbedBuilder } from 'discord.js';

import logger from '@/functions/logger';
import config from '../app.config';

export default async (interaction, error) => {
	const embedMessage = new EmbedBuilder()
		.setColor(config.colors.danger)
		.setAuthor({ name: error.name })
		.setTitle(`:x: ${error.title || 'Oops! Unexpected error'}!`)
		.setDescription(error.message || 'Wait a few seconds and try again.');

	logger.error(`[${error.name}] ${error.message}`);

	if (interaction.deferred) {
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
};

import { EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import { pause } from '@/functions/musicUtils';

export default async (interaction) => {
	const { guild } = interaction;

	await pause(guild.id);

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setTitle(':pause_button: The music has paused!')
		]
	});
};

import { EmbedBuilder } from 'discord.js';

import { pause } from '@/functions/musicUtils';
import config from '@/app.config';

export default async (interaction) => {
	const { channel } = interaction.member.voice;

	await pause(channel);

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setTitle(':pause_button: The music has paused!')
		]
	});
};

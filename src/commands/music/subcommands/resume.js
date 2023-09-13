import { EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import { resume } from '@/functions/musicUtils';

export default async (interaction) => {
	const { channel } = interaction.member.voice;

	await resume(channel);

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setTitle(':arrow_forward: Resume the music!')
		]
	});
};

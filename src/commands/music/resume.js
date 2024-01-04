import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import config from '@/app.config';
import { resume } from '@/functions/musicUtils';

export default {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume the music!'),

	async execute(interaction) {
		const { guild } = interaction;

		await resume(guild.id);

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.success)
					.setTitle(':arrow_forward: Resume the music!')
			]
		});
	}
};

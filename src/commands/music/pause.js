import appConfig from '@/app.config';
import { pause } from '@/functions/musicUtils';
import errorHandler from '@/handlers/errorHandler';
import { EmbedBuilder } from '@discordjs/builders';
import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the music!'),

	async execute(interaction) {
		try {
			const { guild } = interaction;

			await pause(guild.id);

			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(appConfig.colors.success)
						.setTitle(':pause_button: The music has paused!')
				]
			});
		} catch (e) {
			errorHandler(interaction, e);
		}
	}
};

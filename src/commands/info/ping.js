import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import config from '../../app.config';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the ping of the bot.'),

	async execute(interaction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.green)
					.setTitle('Pong!')
					.setDescription(
						`:ping_pong: The ping of the bot are \`${interaction.client.ws.ping}ms\``
					)
			]
		});
	}
};

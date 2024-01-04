import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import config from '@/app.config';
import { getQueue } from '@/functions/musicUtils';
import errorHandler from '@/handlers/errorHandler';

export default {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Info about the current song!'),

	async execute(interaction) {
		try {
			const { channel } = interaction.member.voice;

			const queue = getQueue(channel);

			const progressBar = await queue.node.createProgressBar({
				queue: false,
				length: 20
			});

			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.success)
						.setAuthor({ name: 'Current song info' })
						.setTitle(`${queue.currentTrack.title}`)
						.setURL(`${queue.currentTrack.url}`)
						.setDescription(`${progressBar}\nProgress bar`)
						.setThumbnail(`${queue.currentTrack.thumbnail}`)
				]
			});
		} catch (e) {
			errorHandler(interaction, e);
		}
	}
};

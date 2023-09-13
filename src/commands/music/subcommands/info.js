import { EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import { getQueue } from '@/functions/musicUtils';

export default async (interaction) => {
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
};

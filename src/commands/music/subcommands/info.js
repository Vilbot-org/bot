import { EmbedBuilder } from 'discord.js';
import config from '../../../app.config';

export default async (client, interaction, queue) => {
	if (!queue)
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.danger)
					.setTitle(':x: Music is not playing!')
			],
			ephemeral: true
		});

	const progressBar = await queue.node.createProgressBar({
		queue: false,
		length: 20
	});

	return interaction.reply({
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

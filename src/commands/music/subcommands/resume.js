import { EmbedBuilder } from 'discord.js';
import config from '../../../app.config';

export default async (interaction, queue) => {
	if (!queue) throw new Error('no-songs-queue');

	const isPaused = await queue.node.isPaused();

	if (!isPaused) throw new Error('music-resumed');

	await queue.node.resume();

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setTitle(':arrow_forward: Resume the music!')
		]
	});
};

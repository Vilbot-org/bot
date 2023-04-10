import { EmbedBuilder } from 'discord.js';
import config from '../../../app.config';

export default async (interaction, queue) => {
	if (!queue)
		throw new Error(
			'Music queue',
			'No songs in the queue, use `/music play <song>` do add songs.'
		);

	const isPaused = await queue.node.isPaused();

	if (!isPaused)
		throw new Error(
			'The music in not paused',
			'Use `/music pause` to pause a song.'
		);

	await queue.node.resume();

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setTitle(':arrow_forward: Resume the music!')
		]
	});
};

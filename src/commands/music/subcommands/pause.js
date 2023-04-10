import { EmbedBuilder } from 'discord.js';
import config from '../../../app.config';

export default async (interaction, queue) => {
	if (!queue)
		throw new Error(
			'Music queue',
			'No songs in the queue, use `/music play <song>` do add songs.'
		);

	const isPaused = await queue.node.pause();

	if (!isPaused)
		throw new Error(
			'The music is already paused',
			'Use `/music resume` to resume a song.'
		);

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setTitle(':pause_button: The music has paused!')
		]
	});
};

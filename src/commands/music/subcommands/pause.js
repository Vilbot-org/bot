import { EmbedBuilder } from 'discord.js';
import config from '../../../app.config';
import MusicErrors from '../../../errors/MusicErrors';

export default async (interaction, queue) => {
	if (!queue)
		throw new MusicErrors(
			'Music queue',
			'No songs in the queue, use `/music play <song>` do add songs.'
		);

	const isPaused = await queue.node.pause();

	if (!isPaused)
		throw new MusicErrors(
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

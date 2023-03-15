import { EmbedBuilder } from 'discord.js';
import config from '../../../app.config';

export default async (interaction, queue) => {
	if (!queue) throw new Error('no-songs-queue');

	const isPaused = await queue.node.pause();

	if (!isPaused) throw new Error('music-already-paused');

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setTitle(':pause_button: The music has paused!')
		]
	});
};

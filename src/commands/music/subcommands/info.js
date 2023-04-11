import { EmbedBuilder } from 'discord.js';
import config from '../../../app.config';
import MusicErrors from '../../../errors/MusicErrors';

export default async (interaction, queue) => {
	if (!queue)
		throw new MusicErrors(
			'Music queue',
			'No songs in the queue, use `/music play <song>` do add songs.'
		);

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

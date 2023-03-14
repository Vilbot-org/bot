import { EmbedBuilder } from 'discord.js';

import config from '../../../app.config';

export default async (client, interaction, queue) => {
	if (!queue) throw new Error('no-songs-queue');

	const embedMsg = new EmbedBuilder()
		.setAuthor({ name: 'Music queue!' })
		.setTitle('Current song:')
		.setColor(config.colors.success)
		.setThumbnail(queue.currentTrack.thumbnail)
		.setDescription(`[${queue.currentTrack.title}](${queue.currentTrack.url})`)
		.setFooter({ text: `There are ${queue.getSize()} songs in the queue` });

	if (!queue.isEmpty())
		embedMsg.addFields(
			queue.tracks.map((track, key) => ({
				name: `${key + 1}. ${track.title}`,
				value: '\u200B',
				inline: true
			}))
		);

	await interaction.reply({
		embeds: [embedMsg]
	});
};

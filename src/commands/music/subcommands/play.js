import { EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import { play } from '@/functions/musicUtils';

export default async (interaction) => {
	const query = interaction.options.getString('song');
	const { channel } = interaction.member.voice;

	await interaction.deferReply();

	const { queue, track } = await play(query, interaction.guildId, channel.id);

	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setAuthor({ name: 'Add to the queue' })
				.setTitle(`${track.title}`)
				.setURL(`${track.url}`)
				.setThumbnail(`${track.thumbnail}`)
				.setFields(
					{ name: 'Duration', value: `${track.duration}`, inline: true },
					{
						name: 'Position in the queue',
						value: `${queue.getSize() > 0 ? queue.getSize() : 'Playing now'}`,
						inline: true
					}
				)
				.setFooter({
					text:
						queue.getSize() >= 1
							? `Next song in the queue: ${queue.tracks.at(0).title}`
							: 'This is the first song in the queue.'
				})
		]
	});
};

import { useMasterPlayer as player } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

import config from '../../../app.config';

export default async (interaction) => {
	const query = interaction.options.getString('song');
	const { channel } = interaction.member.voice;

	await interaction.deferReply();

	const { queue, track } = await player().play(channel, query, {
		nodeOptions: {
			metadata: interaction,
			volume: 40
		}
	});

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

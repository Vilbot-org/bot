import { EmbedBuilder } from '@discordjs/builders';
import { useMainPlayer as player } from 'discord-player';

import config from '@/app.config';
import client from '../../Client';

player().events.on('playerStart', (queue, track) => {
	console.log(client.voice.adapters);

	client.channels.cache.get(queue.metadata.channel).send({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.info)
				.setAuthor({ name: 'Started playing' })
				.setTitle(`${track.title}`)
				.setURL(`${track.url}`)
				.setThumbnail(`${track.thumbnail}`)
				.setFooter({
					text:
						queue.getSize() >= 1
							? `Next song in the queue: ${queue.tracks.at(0).title}`
							: 'No more songs queued'
				})
		]
	});
});

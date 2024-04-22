import { EmbedBuilder } from '@discordjs/builders';
import { useMainPlayer as player } from 'discord-player';

import config from '@/app.config';
import socket from '@/functions/sockets/socketClient';
import { formatQueue, formatTrack } from '@/utils/queueFormatter';
import client from '../../Client';

player().events.on('playerStart', (queue, track) => {
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
		],
		flags: [4096]
	});

	socket.emit('bot.startedPlaying', formatQueue(queue), queue.guild.id);
});

player().events.on('audioTrackAdd', (queue, track) => {
	socket.emit('bot.playedTrack', formatTrack(track), queue.guild.id);
});

player().events.on('playerSkip', (queue) => {
	socket.emit('bot.skipedTrack', queue.guild.id);
});

player().events.on('playerResume', (queue) => {
	socket.emit('bot.resumedMusicPlayer', queue.guild.id);
});

player().events.on('playerPause', (queue) => {
	socket.emit('bot.pausedMusicPlayer', queue.guild.id);
});

player().events.on('queueDelete', (queue) => {
	socket.emit('bot.deletedQueue', queue.guild.id);
});

player().events.on('emptyQueue', (queue) => {
	socket.emit('bot.emptyQueue', queue.guild.id);
});

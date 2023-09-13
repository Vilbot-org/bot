import { useMasterPlayer as player, useQueue } from 'discord-player';
import MusicErrors from '../errors/MusicErrors';
import socket from './sockets/socketClient';

const getQueue = (guildChannel) => {
	const queue = useQueue(guildChannel);

	if (!queue) {
		throw new MusicErrors(
			'Music queue',
			'No songs in the queue, use `/music play <song>` to add songs.'
		);
	}

	socket.emit('bot.queue', { songs: queue.tracks, guild: guildChannel });

	return queue;
};

const handleQueueErrors =
	(func) =>
	async (...args) => {
		// eslint-disable-next-line no-useless-catch
		try {
			const queue = getQueue(args[0]);
			return await func(queue, ...args);
		} catch (error) {
			throw error;
		}
	};

const play = async (query, guildChannel) => {
	const searchResult = await player().search(query);

	if (!searchResult.hasTracks()) {
		throw new MusicErrors(
			'No results found',
			'No results were found for that request, try another name or a YouTube URL.'
		);
	}

	const { queue, track } = await player().play(guildChannel, searchResult, {
		nodeOptions: {
			volume: 40,
			metadata: guildChannel
		}
	});

	socket.emit('bot.addedSong', { song: track, guild: guildChannel });

	return { queue, track };
};

const fskip = handleQueueErrors(async (queue) => {
	await queue.node.skip();

	socket.emit('bot.skippedSong', {
		song: queue.currentTrack,
		guild: queue.channel.id
	});

	return queue;
});

const pause = handleQueueErrors(async (queue) => {
	const isPaused = await queue.node.pause();

	if (!isPaused) {
		throw new MusicErrors(
			'The music is already paused',
			'Use `/music resume` to resume a song.'
		);
	}

	socket.emit('bot.pausedSong', queue.channel.id);

	return true;
});

const resume = handleQueueErrors(async (queue) => {
	const isPaused = await queue.node.isPaused();

	if (!isPaused) {
		throw new MusicErrors(
			'The music is not paused',
			'Use `/music pause` to pause a song.'
		);
	}

	await queue.node.resume();

	socket.emit('bot.resumedSong', queue.channel.id);

	return true;
});

const quit = handleQueueErrors(async (queue) => {
	await queue.delete();

	return true;
});

export { getQueue, play, fskip, resume, pause, quit };

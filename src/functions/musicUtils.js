import { useMasterPlayer as player, useQueue } from 'discord-player';
import MusicErrors from '../errors/MusicErrors';
import formatSong from './formatSong';
import logger from './logger';
import socket from './sockets/socketClient';
import socketError from './sockets/socketFunctions';

const getQueue = (guild) => {
	const queue = useQueue(guild);

	if (!queue) {
		throw new MusicErrors(
			'Music queue',
			'No songs in the queue, use `/music play <song>` to add songs.'
		);
	}

	return queue;
};

const handleQueueErrors =
	(func) =>
	async (...args) => {
		try {
			const queue = getQueue(args[0]);
			return await func(queue, ...args.slice(1));
		} catch (error) {
			logger.error(error);
			socketError(error);
			return error;
		}
	};

const play = async (query, guild, guildChannel) => {
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

	socket.emit('bot.addedSong', {
		song: formatSong(track),
		guild
	});

	return { queue, track };
};

const skip = handleQueueErrors(async (queue) => {
	await queue.node.skip();

	socket.emit('bot.skippedSong', queue.guild.id);

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

	socket.emit('bot.pausedSong', queue.guild.id);

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

	socket.emit('bot.resumedSong', queue.guild.id);

	return true;
});

const quit = handleQueueErrors(async (queue) => {
	await queue.delete();

	return true;
});

const removeTrack = handleQueueErrors((queue, trackIndex) => {
	queue.removeTrack(trackIndex);

	socket.emit('bot.removedSong', queue.guild.id, trackIndex);
	return true;
});

const playPlaylist = async (songs, guild, guildChannel) => {
	const { queue } = await player().play(guildChannel, songs[0], {
		nodeOptions: {
			metadata: guildChannel,
			volume: 40
		}
	});

	if (songs.length > 1) {
		songs.forEach(async (song, index) => {
			if (index > 0) {
				const searchResult = await player().search(song);

				queue.insertTrack(searchResult.tracks[0], queue.getSize());
			}
		});
	}

	socket.emit('bot.playedPlaylist', { songs, guild });

	return true;
};

export { getQueue, pause, play, quit, removeTrack, resume, skip, playPlaylist };

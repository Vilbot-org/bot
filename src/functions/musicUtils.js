import { useMainPlayer as player, useQueue } from 'discord-player';
import MusicErrors from '../errors/MusicErrors';
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
			socketError(error);
			throw new MusicErrors(error.title, error.message);
		}
	};

const play = async (query, guildChannel) => {
	if (!guildChannel) {
		throw new MusicErrors(
			'You are not on any voice channel',
			'You must on voice channel to play music.'
		);
	}

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
			metadata: { channel: guildChannel }
		}
	});

	return { queue, track };
};

const skip = handleQueueErrors(async (queue) => {
	await queue.node.skip();

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

	return true;
});

const quit = handleQueueErrors(async (queue) => {
	await queue.delete();

	return true;
});

const removeTrack = handleQueueErrors((queue, trackIndex) => {
	queue.removeTrack(trackIndex);

	return true;
});

const playPlaylist = async (songs, voiceChannelID) => {
	if (!voiceChannelID) {
		throw new MusicErrors(
			'You are not on any voice channel',
			'You must on voice channel to play music.'
		);
	}

	const { queue } = await play(songs[0], voiceChannelID);

	if (songs.length > 1) {
		songs.forEach(async (song, index) => {
			if (index > 0) {
				const searchResult = await player().search(song);

				queue.insertTrack(searchResult.tracks[0], queue.getSize());
			}
		});
	}

	return true;
};

export { getQueue, pause, play, playPlaylist, quit, removeTrack, resume, skip };

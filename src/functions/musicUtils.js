import { useMainPlayer as player, useQueue } from 'discord-player';
import MusicErrors from '../errors/MusicErrors';
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
			socketError(error);
			throw new MusicErrors(error.title, error.message);
		}
	};

const play = async (query, currentVoiceChannelID, user) => {
	if (!currentVoiceChannelID) {
		throw new MusicErrors(
			'You are not on any voice channel',
			'You must be on a voice channel to play music.'
		);
	}

	const searchResult = await player().search(query);
	if (!searchResult.hasTracks()) {
		throw new MusicErrors(
			'No results found',
			'No results were found for that request, try another name or a YouTube URL.'
		);
	}

	searchResult.setRequestedBy(user);

	const { queue, track } = await player().play(
		currentVoiceChannelID,
		searchResult,
		{
			nodeOptions: {
				volume: 40,
				leaveOnEndCooldown: 300000,
				metadata: { channel: currentVoiceChannelID }
			}
		}
	);

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

	socket.emit('bot.removedTrack', trackIndex, queue.guild.id);

	return true;
});

const playPlaylist = async (tracks, currentVoiceChannel, user) => {
	if (!currentVoiceChannel.voiceId) {
		throw new MusicErrors(
			'You are not on any voice channel',
			'You must be on a voice channel to play music.'
		);
	}

	if (tracks.length >= 1) {
		tracks.forEach(async (track) => {
			await play(track, currentVoiceChannel.voiceId, user);
		});
	}

	return true;
};

export { getQueue, pause, play, playPlaylist, quit, removeTrack, resume, skip };

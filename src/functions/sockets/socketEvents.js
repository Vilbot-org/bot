import User from '@/models/User';
import { useQueue } from 'discord-player';
import formatSong from '../formatSong';
import {
	pause,
	play,
	playPlaylist,
	removeTrack,
	resume,
	skip
} from '../musicUtils';
import socket from './socketClient';
import socketError from './socketFunctions';

socket.on('bot.getQueue', async (guild) => {
	try {
		const fetchedQueue = useQueue(guild);
		const isPaused = fetchedQueue.node.isPaused();

		if (!fetchedQueue) {
			socket.emit('bot.queue', { guild, queue: null });
			return;
		}

		const data = {
			guild,
			queue: {
				isPaused,
				currentSong: {
					...formatSong(fetchedQueue.currentTrack),
					playbackTime: fetchedQueue.node.playbackTime
				},
				songs: fetchedQueue?.tracks.map((track) => formatSong(track))
			}
		};

		socket.emit('bot.queue', data);
	} catch (error) {
		socketError(error);
	}
});

socket.on('bot.playSong', async ({ query, user: userID }) => {
	try {
		const user = await User.findById(userID);
		if (!user) {
			throw new Error('The user is not exist');
		}

		const { voiceChannel } = user;
		if (!voiceChannel) {
			throw new Error('The user is not on any voice channel');
		}

		await play(query, voiceChannel.voice);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

socket.on('bot.nextSong', async (guild) => {
	try {
		await skip(guild);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

socket.on('bot.pauseSong', async (guild) => {
	try {
		await pause(guild);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

socket.on('bot.resumeSong', async (guild) => {
	try {
		await resume(guild);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

socket.on('bot.removeSong', (guild, songIndex) => {
	try {
		removeTrack(guild, songIndex);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

socket.on('bot.playPlaylist', async ({ songs, voiceChannelID, user }) => {
	try {
		await playPlaylist(songs, voiceChannelID);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

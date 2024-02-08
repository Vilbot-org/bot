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

socket.on('server.requestQueue', async (guildID) => {
	try {
		const fetchedQueue = useQueue(guildID);
		const isPaused = fetchedQueue.node.isPaused();

		if (!fetchedQueue) {
			socket.emit('bot.requestedQueue', null, guildID);
			return;
		}

		const queue = {
			isPaused,
			currentSong: {
				...formatSong(fetchedQueue.currentTrack),
				playbackTime: fetchedQueue.node.playbackTime
			},
			songs: fetchedQueue?.tracks.map((track) => formatSong(track))
		};

		socket.emit('bot.requestedQueue', queue, guildID);
	} catch (error) {
		socketError(error);
	}
});

socket.on('server.requestPlayTrack', async (trackURL, voiceChannelID, user) => {
	try {
		await play(trackURL, voiceChannelID);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

socket.on('server.requestSkipTrack', async (guildID) => {
	try {
		await skip(guildID);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

socket.on('server.requestRemoveTrack', (trackIndex, guildID) => {
	try {
		removeTrack(guildID, trackIndex);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

socket.on(
	'server.requestPlayPlaylist',
	async (tracks, voiceChannelID, user) => {
		try {
			await playPlaylist(tracks, voiceChannelID);
		} catch (error) {
			console.log(error);
			socketError(error);
		}
	}
);

socket.on('server.requestResumeMusicPlayer', async (guildID) => {
	try {
		await pause(guildID);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

socket.on('server.requestPauseMusicPlayer', async (guildID) => {
	try {
		await resume(guildID);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

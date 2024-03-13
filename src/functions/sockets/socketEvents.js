import { useQueue } from 'discord-player';
import { formatTrack } from '../../utils/formatMessages';
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
				...formatTrack(fetchedQueue.currentTrack),
				playbackTime: fetchedQueue.node.playbackTime
			},
			songs: fetchedQueue?.tracks.map((track) => formatTrack(track))
		};

		socket.emit('bot.requestedQueue', queue, guildID);
	} catch (error) {
		socketError(error);
	}
});

socket.on('server.requestPlayTrack', async (trackURL, voiceChannelID, user) => {
	try {
		await play(trackURL, voiceChannelID, user);
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

socket.on('server.requestPlayPlaylist', async (tracks, voiceChannel, user) => {
	try {
		await playPlaylist(tracks, voiceChannel, user);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

socket.on('server.requestResumeMusicPlayer', async (guildID) => {
	try {
		await resume(guildID);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

socket.on('server.requestPauseMusicPlayer', async (guildID) => {
	try {
		await pause(guildID);
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

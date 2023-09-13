import socket from './socketClient';
import { fskip, getQueue, pause, play, resume } from '../musicUtils';
import socketError from './socketFunctions';

socket.on('bot.getQueue', async (guild) => {
	try {
		await getQueue(guild);
	} catch (error) {
		socketError(error);
	}
});

socket.on('bot.playSong', async (data) => {
	try {
		await play(data.query, data.guild);
	} catch (error) {
		socketError(error);
	}
});

socket.on('bot.nextSong', async (guild) => {
	try {
		await fskip(guild);
	} catch (error) {
		socketError(error);
	}
});

socket.on('bot.pauseSong', async (guild) => {
	try {
		await pause(guild);
	} catch (error) {
		socketError(error);
	}
});

socket.on('bot.resumeSong', async (guild) => {
	try {
		await resume(guild);
	} catch (error) {
		socketError(error);
	}
});

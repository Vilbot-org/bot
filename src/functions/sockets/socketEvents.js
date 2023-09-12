import socket from './socketClient';
import play from '../music/play';
import logger from '../logger';

socket.on('bot.playSong', async (query) => {
	try {
		const { track } = await play(query, '1026501495513952349');

		console.log(track.title);
	} catch (error) {
		console.log(error);
	}
	logger.info('play song!');
});

socket.on('bot.nextSong', async () => {
	logger.info('next song!');
});

socket.on('bot.prevSong', async () => {
	logger.info('prev song!');
});

socket.on('bot.pauseSong', async () => {
	logger.info('pause song!');
});

socket.on('bot.resumeSong', async () => {
	logger.info('resume song');
});

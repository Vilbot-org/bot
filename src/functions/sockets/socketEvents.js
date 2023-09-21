import logger from '../logger';
import socket from './socketClient';

socket.on('bot.playSong', async () => {
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

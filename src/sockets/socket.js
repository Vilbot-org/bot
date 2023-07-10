import io from 'socket.io-client';
import jwt from 'jsonwebtoken';

import play from '../functions/music/play';
import logger from '../functions/logger';

const token = jwt.sign({ user: 'Vilbot' }, process.env.JWT_SECRET_KEY);

const initSocket = () => {
	const socket = io(process.env.SOCKET_URL, {
		auth: {
			token
		}
	});

	logger.info(`Success connection to socket server`);

	socket.on('bot.playSong', async (query) => {
		const { track } = await play(query, '1026501495513952349');

		console.log(track.title);
	});

	/* socket.on('bot.nextSong', async () => {});

	socket.on('bot.prevSong', async () => {});

	socket.on('bot.pauseSong', async () => {});

	socket.on('bot.resumeSong', async () => {}); */
};

export default initSocket;

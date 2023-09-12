import { io } from 'socket.io-client';
import jwt from 'jsonwebtoken';
import logger from '../logger';

const token = jwt.sign({ user: 'Vilbot' }, process.env.JWT_SECRET_KEY);

const socket = io(process.env.SOCKET_URL, {
	auth: {
		token
	}
});

socket.on('connect', () => {
	logger.info(`Success connection to socket server`);
});

export default socket;

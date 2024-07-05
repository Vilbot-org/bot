import { sign } from 'jsonwebtoken';
import { io } from 'socket.io-client';
import env from '@/utils/validEnv';

const socketConnection = () => {
	const token = sign({ name: 'Vilbot' }, env.JWT_SECRET_KEY);

	const socket = io(env.SOCKET_URL, {
		extraHeaders: {
			authorization: token
		},
		auth: {
			token
		},
		autoConnect: true
	});

	return socket;
};

export default socketConnection;

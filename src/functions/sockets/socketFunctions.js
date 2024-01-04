import socket from './socketClient';

const socketError = (error) => {
	socket.emit('bot.error', { error });
};

export default socketError;

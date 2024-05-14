import type BotClient from '@/classes/BotClient';
import { SocketEvents } from '@/enums/Sockets';
import logger from '@/utils/logger';

const socketError = (client: BotClient, error: Error) => {
	logger.error(error);
	client.socket.emit(SocketEvents.BotError, error);
};

export default socketError;

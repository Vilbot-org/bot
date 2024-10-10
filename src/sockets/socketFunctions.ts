import type BotClient from '@/classes/BotClient';
import { SocketEvents } from '@/enums/Sockets';
import Logger from '@/common/services/Logger';

const socketError = (client: BotClient, error: Error) => {
	Logger.error('socketEvents', 'socketError', error.message);
	client.socket.emit(SocketEvents.BotError, error);
};

export default socketError;

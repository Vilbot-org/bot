import BotError from './BotError';

class PlaylistError extends BotError {
	constructor(title: string, message: string) {
		super('Playlist Error', title, message);
	}
}

export default PlaylistError;

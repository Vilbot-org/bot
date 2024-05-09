import BotError from './BotError';

class MusicError extends BotError {
	constructor(title: string, message: string) {
		super('Music Error', title, message);
	}
}

export default MusicError;

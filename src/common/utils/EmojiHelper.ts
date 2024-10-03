import { formatEmoji } from 'discord.js';

import logger from '../../utils/logger';

const emojis = {
	play: '1284536468093538304',
	playing: '1284536599232778270',
	next: '1284536711765823551',
	pause: '1284536242209427539',
	previous: '1284536712986366044'
} as const;

export const getEmoji = (name: keyof typeof emojis): string => {
	if (!emojis[name]) {
		logger.warn(`Emoji ${name} not found`);
		return formatEmoji(emojis['play']);
	}
	return formatEmoji(emojis[name]);
};

import logger from '@/utils/logger';
import { Player, PlayerInitOptions } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import type { Client } from 'discord.js';

class PlayerClient extends Player {
	constructor(client: Client, options: PlayerInitOptions) {
		super(client, options);

		this.extractors.register(YoutubeiExtractor, {
			authentication: '',
			streamOptions: {
				useClient: 'iOS',
				highWaterMark: 2 * 1_024 * 1_024
			}
		});

		this.extractors.loadDefault((ext) => !['YouTubeExtractor'].includes(ext));
		logger.trace(`discord-player loaded dependencies:\n${this.scanDeps()}`);
	}
}

export default PlayerClient;

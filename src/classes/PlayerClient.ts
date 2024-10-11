import Logger from '@/common/services/Logger';
import { Player, PlayerInitOptions } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import type { Client } from 'discord.js';

class PlayerClient extends Player {
	private logger: Logger;

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
		this.logger = new Logger('PlayerClient', 'VilbotPlayer');
		this.logger.trace(
			`discord-player loaded dependencies:
      ${this.scanDeps()}`
		);
	}
}

export default PlayerClient;

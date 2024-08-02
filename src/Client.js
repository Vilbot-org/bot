import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';

import commandHandler from './handlers/commandHandler';
import eventHandler from './handlers/eventHandler';
import logger from './functions/logger';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences
	]
});

client.commands = new Collection();

commandHandler(client);
eventHandler(client);

const ipRotationConfig = {
	blocks: [],
	exclude: [],
	maxRetries: 3
};

const player = new Player(client, {
	useLegacyFFmpeg: false,
	skipFFmpeg: false,
	ipconfig: ipRotationConfig
});

player.extractors.register(YoutubeiExtractor, {
	authentication: process.env.YT_EXTRACTOR_AUTH || ''
});

player.extractors.loadDefault((ext) => !['YouTubeExtractor'].includes(ext));

logger.trace(`discord-player loaded dependencies:\n${player.scanDeps()}`);

export default client;

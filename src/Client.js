import { Player } from 'discord-player';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

import commandHandler from './handlers/commandHandler';
import eventHandler from './handlers/eventHandler';

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

const player = new Player(client);

player.extractors.loadDefault();

export default client;

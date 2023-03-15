import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { Player } from 'discord-player';

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

const player = Player.singleton(client, {
	ytdlOptions: {
		quality: 'highestaudio',
		highWaterMark: 1 < 25
	}
});

player.events.on('playerStart', (queue, track) => {
	// we will later define queue.metadata object while creating the queue
	queue.metadata.channel.send(`Started playing **${track.title}**!`);
});

export default client;

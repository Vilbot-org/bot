//Enviroment variables and configs
import { GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import Client from './src/structures/Client';

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

client.login(process.env.DISCORD_TOKEN);

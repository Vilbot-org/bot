import { GatewayIntentBits } from 'discord.js';
import BotClient from './classes/BotClient';
import env from './utils/validEnv';

const vilbot = new BotClient({
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

vilbot.start(env.DISCORD_TOKEN);

export default vilbot;

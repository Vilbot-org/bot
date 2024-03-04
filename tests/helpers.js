import Discord, { Client } from 'discord.js';

const createTestClient = ({ name, command }) => {
	const client = new Client({
		intents: [
			Discord.GatewayIntentBits.Guilds,
			Discord.GatewayIntentBits.GuildVoiceStates
		]
	});

	client.slashCommandInteractions = new Discord.Collection();
	client.slashCommandInteractions.set(name, command);

	return client;
};

export default createTestClient;

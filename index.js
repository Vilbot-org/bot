//Enviroment variables and configs
require("dotenv").config();

const Client = require("./src/structures/Client");

const client = new Client({
	intents: [
		"Guilds",
		"GuildMessages",
		"GuildInvites",
		"GuildMessageReactions",
		"GuildVoiceStates",
		"GuildMembers",
		"GuildPresences",
	],
});

client.login(process.env.DISCORD_TOKEN);

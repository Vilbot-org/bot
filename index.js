//Enviroment variables and configs
import "dotenv/config";
import Client from "./src/structures/Client.js";

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

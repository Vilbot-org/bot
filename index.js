// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

//Enviroment variables and configs
const dotenv = require("dotenv");
dotenv.config();

const configs = require("./config.json");

const fs = require("node:fs");
const path = require("node:path");

// Create a new client instance
const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildVoiceStates,
];

const client = new Client({
	intents: intents,
});

//Read commands folder
const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
//Load commands to the bot
client.commands = new Collection();

commandsFiles.forEach(file => {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	client.commands.set(command.data.name, command);
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
	console.log(`Bot listo como: ${client.user.tag}`);
});

//================================================
//						Read chat commands
//================================================
client.on("messageCreate", async message => {
	if (message.author.bot || !message.guild) return;
	if (!message.content.startsWith(configs.prefix)) return;

	//Select command dynamically
	const commandType = message.content.split(".")[1].split(" ")[0];
	const command = message.content.split(" ")[1];
	const args = message.content.split(" ").slice(2);
	try {
		const commandFile = require(`./commands/${commandType}/${command}`);
		return commandFile.run(message, args);
	} catch (error) {
		console.error(error);
	}
});

//================================================
//						Read slash commands
//================================================
client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
	}
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

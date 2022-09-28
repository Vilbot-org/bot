// Require the necessary discord.js classes
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

//Enviroment variables
const dotenv = require("dotenv");

dotenv.config();

// Create a new client instance
const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
];

const client = new Client({
	intents: intents,
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
	console.log(`Bot listo como: ${client.user.tag}`);
});

//To read commands
client.on("messageCreate", async message => {
	if (message.author.bot || !message.guild) return;

	const command = message.content;

	if (command == "ping") {
		const embed = new EmbedBuilder()
			.setTitle("Pong")
			.setDescription(`Ping es de ${client.ws.ping}ms`)
			.setColor("02fef7");
		message.channel.send({ embeds: [embed] });
	}
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === "ping") {
		await interaction.reply("Pong!");
	} else if (commandName === "server") {
		await interaction.reply(
			`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
		);
	} else if (commandName === "user") {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

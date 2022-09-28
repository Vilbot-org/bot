const { REST, SlashCommandBuilder, Routes } = require("discord.js");
//Enviroment variables
const dotenv = require("dotenv");

dotenv.config();

const commands = [
	new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"),
	new SlashCommandBuilder().setName("server").setDescription("Replies with server info!"),
	new SlashCommandBuilder().setName("user").setDescription("Replies with user info!"),
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

rest
	.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
	.then(data => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { readdirSync } = require('node:fs');
const { join } = require('node:path');

const path = './dist/commands';
const categories = readdirSync(path);

const commandsFiles = categories
	.map((category) => ({
		category,
		file: readdirSync(`${path}/${category}`).filter((file) =>
			file.endsWith('.js')
		)
	}))
	.flatMap((commandFile) =>
		commandFile.file.map((file) => ({ category: commandFile.category, file }))
	);

const importCommand = async (commandFile) => {
	try {
		const commandPath = join(
			process.cwd(),
			path,
			commandFile.category,
			commandFile.file
		);
		const commandObject = require(commandPath).default;

		return commandObject.data.toJSON();
	} catch (e) {
		console.error(`Failed to import command ${commandFile.file}: ${e}`);
	}
};

const getRoute = () =>
	process.env.APP_ENV === 'development'
		? Routes.applicationGuildCommands(
				process.env.CLIENT_ID,
				process.env.GUILD_ID
		  )
		: Routes.applicationCommands(process.env.CLIENT_ID);

(async () => {
	const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
	const route = getRoute();
	const commands = (
		await Promise.all(
			commandsFiles.map(async (commandFile) => importCommand(commandFile))
		)
	).filter(Boolean);

	console.log(
		`Deploying commands in ${process.env.APP_ENV} mode for ${
			process.env.APP_ENV === 'development'
				? `guild ${process.env.GUILD_ID}`
				: 'all guilds'
		}.`
	);

	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`
		);

		const data = await rest.put(route, { body: commands });

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`
		);

		process.exit();
	} catch (e) {
		console.error(JSON.stringify(e));
		process.exit(1);
	}
})();

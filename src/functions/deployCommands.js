import { REST, Routes } from 'discord.js';
import 'dotenv/config';
import { readdirSync } from 'fs';
import { join } from 'path';

const path = './src/commands';
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
	const commandObject = (
		await import(
			`${join(process.cwd(), path, commandFile.category, commandFile.file)}`
		)
	).default;

	return commandObject.data.toJSON();
};

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const route =
	process.env.APP_ENV === 'dev'
		? Routes.applicationGuildCommands(
				process.env.CLIENT_ID,
				process.env.GUILD_ID
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  )
		: Routes.applicationCommands(process.env.CLIENT_ID);

(async () => {
	const commands = await Promise.all(
		commandsFiles.map(async (commandFile) => importCommand(commandFile))
	);

	console.log(
		`Deploying commands in ${process.env.APP_ENV} mode for ${
			process.env.APP_ENV === 'dev'
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
		console.error(JSON.stringify(e.rawError.errors, null, 2));
		process.exit(1);
	}
})();

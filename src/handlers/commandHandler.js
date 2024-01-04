import { readdirSync } from 'fs';
import { join } from 'path';
import logger from '../functions/logger';

export default (client) => {
	const path = join(__dirname, '..', 'commands');
	const categories = readdirSync(path);

	categories.map(async (category) => {
		const commandsPath = join(path, category);
		const commands = readdirSync(commandsPath).filter((file) =>
			file.endsWith('.js')
		);

		await Promise.all(
			commands.map(async (command) => {
				const commandPath = join(commandsPath, command);
				const commandObject = (await import(commandPath)).default;

				client.commands.set(commandObject.data.name, commandObject);

				logger.info(
					`Command ${commandObject.data.name} of the category ${category} are load! (${commandObject.data.name})`
				);
			})
		);
	});
};

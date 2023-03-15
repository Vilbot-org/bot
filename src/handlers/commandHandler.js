import { readdirSync } from 'fs';
import { join } from 'path';

export default (client) => {
	const path = './src/commands';
	const categories = readdirSync(path);

	categories.map(async (category) => {
		const commands = readdirSync(`${path}/${category}`).filter((file) =>
			file.endsWith('.js')
		);

		await Promise.all(
			commands.map(async (command) => {
				const commandObject = (
					await import(`${join(process.cwd(), path, category, command)}`)
				).default;

				client.commands.set(commandObject.data.name, commandObject);

				console.log(
					`Command ${commandObject.data.name} of the category ${category} are load! (${commandObject.data.name})`
				);
			})
		);
	});
};

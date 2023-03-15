import { readdirSync } from 'fs';
import { join } from 'path';

export default (client) => {
	const path = './src/events';
	const categories = readdirSync(path);

	categories.map(async (category) => {
		const events = readdirSync(`${path}/${category}`);

		await Promise.all(
			events.map(async (event) => {
				const eventObject = (
					await import(`${join(process.cwd(), path, category, event)}`)
				).default;

				if (eventObject.once) {
					client.once(eventObject.name, (...args) =>
						eventObject.execute(...args)
					);
				} else {
					client.on(eventObject.name, (...args) =>
						eventObject.execute(...args)
					);
				}

				console.log(
					`Event ${eventObject.name} of the category ${category} are load! (${eventObject.name})`
				);
			})
		);
	});
};

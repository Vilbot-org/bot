import { readdirSync } from 'fs';
import { join } from 'path';
import logger from '../functions/logger';

export default (client) => {
	const path = join(__dirname, '..', 'events');
	const categories = readdirSync(path);

	categories.map(async (category) => {
		const eventsPath = join(path, category);
		const events = readdirSync(eventsPath).filter((file) =>
			file.endsWith('.js')
		);

		await Promise.all(
			events.map(async (event) => {
				const eventPath = join(eventsPath, event);
				const eventObject = (await import(eventPath)).default;

				if (eventObject.once) {
					client.once(eventObject.name, (...args) =>
						eventObject.execute(...args)
					);
				} else {
					client.on(eventObject.name, (...args) =>
						eventObject.execute(...args)
					);
				}

				logger.info(
					`Event ${eventObject.name} of the category ${category} are load! (${eventObject.name})`
				);
			})
		);
	});
};

import { ActivityType, Events } from 'discord.js';

import Guild from '@/models/Guild';
import databaseConnection from '../../functions/databaseConnection';
import logger from '../../functions/logger';
import '../../functions/sockets/socketEvents';

export default {
	name: Events.ClientReady,

	once: true,

	async execute(client) {
		logger.info(`${client.user.tag} are ready!`);

		//Register the status of the bot
		client.user.setActivity('/help', { type: ActivityType.Listening });

		await databaseConnection();

		const findDifferents = (arr1, arr2) => {
			const ids1 = new Set(arr1.map((obj) => obj.id));

			const diffObjects = arr2
				.filter((obj) => !ids1.has(obj.id))
				.map((obj) => ({ _id: obj.id, name: obj.name }));

			return diffObjects;
		};

		const registeredGuilds = await Guild.find();
		const botGuilds = client.guilds.cache;

		if (registeredGuilds.length < botGuilds.length) {
			const unregisterGuilds = findDifferents(registeredGuilds, botGuilds);

			await Guild.insertMany(unregisterGuilds);
		}
	}
};

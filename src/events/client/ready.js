import { ActivityType, Events } from 'discord.js';
import databaseConnection from '../../functions/databaseConnection';

export default {
	name: Events.ClientReady,

	once: true,

	async execute(client) {
		console.log(`${client.user.tag} are ready!`);

		//Register the status of the bot
		client.user.setActivity('/help', { type: ActivityType.Listening });

		await databaseConnection();
	}
};

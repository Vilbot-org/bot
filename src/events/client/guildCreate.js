import logger from '@/functions/logger';
import Guild from '@/models/Guild';
import { Events } from 'discord.js';

export default {
	name: Events.GuildCreate,

	async execute(guild) {
		const newGuild = new Guild({
			_id: guild.id,
			name: guild.name
		});

		await newGuild.save();

		logger.info(`The "${newGuild.name}" guild was added.`);
	}
};

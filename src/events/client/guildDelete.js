import logger from '@/functions/logger';
import Guild from '@/models/Guild';
import { Events } from 'discord.js';

export default {
	name: Events.GuildDelete,

	async execute(guild) {
		const deletedGuild = await Guild.findByIdAndDelete(guild.id);

		if (deletedGuild) {
			logger.info(`The "${deletedGuild.name}" guild was removed.`);
		}
	}
};

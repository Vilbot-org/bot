import { Events } from 'discord.js';
import config from '../../app.config';

export default {
	name: Events.MessageCreate,

	async execute(interaction) {
		if (
			interaction.channel.name ===
				`「🎵」${
					config.botName.charAt(0).toLowerCase() + config.botName.slice(1)
				}-music` &&
			interaction.member.user.id !== interaction.client.user.id
		) {
			const { default: exclusiveChannelFunction } = await import(
				'../../functions/exclusiveChannel'
			);
			await exclusiveChannelFunction(interaction);
		}
	}
};

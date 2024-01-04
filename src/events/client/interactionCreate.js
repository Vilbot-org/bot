import errorHandler from '@/handlers/errorHandler';
import { Events } from 'discord.js';

export default {
	name: Events.InteractionCreate,

	async execute(interaction) {
		try {
			const command = interaction.client.commands.get(interaction.commandName);

			if (interaction.isChatInputCommand()) {
				await command.execute(interaction);
			} else if (interaction.isAutocomplete()) {
				await command.autocomplete(interaction);
			}
		} catch (e) {
			errorHandler(interaction, e);
		}
	}
};

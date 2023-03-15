import { Events } from 'discord.js';

export default {
	name: Events.InteractionCreate,

	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		await command.execute(interaction);
	}
};

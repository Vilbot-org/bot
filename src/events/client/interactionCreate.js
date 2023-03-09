import Event from '../../structures/Event';

export default class extends Event {
	constructor(client) {
		super(client, { name: 'interactionCreate' });
	}

	run = async (interaction) => {
		//If the interaction is a button
		if (interaction.isButton()) {
			//If the author of this interaction is our bot
			if (interaction.client.user.id === this.client.user.id) {
				const commandType = interaction.customId.substring(
					interaction.customId.length - 6,
					interaction.customId.length
				);
				const command = interaction.customId.substring(
					0,
					interaction.customId.length - 6
				);

				if (commandType === 'Player') {
					const queue = this.client.player.nodes.get(interaction.guildId);

					const { default: subCommandFunction } = await import(
						`../../commands/music/subcommands/${command}`
					);
					await subCommandFunction(this.client, interaction, queue);
				}
			}
		}
		if (interaction.isChatInputCommand()) {
			const command = this.client.commands.find(
				(cmd) => cmd.name === interaction.commandName
			);

			if (command) command.run(interaction);
		}
	};
}

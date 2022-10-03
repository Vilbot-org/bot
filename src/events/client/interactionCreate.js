const Event = require("../../structures/Event");

const { botName } = require("../../../config.json");

module.exports = class extends Event {
	constructor(client) {
		super(client, { name: "interactionCreate" });
	}

	run = interaction => {
		//If the interaction is a button
		if (interaction.isButton()) {
			//If the author of this interaction is our bot
			if (interaction.client.user.username == botName) {
				const commandType = interaction.customId.substring(
					interaction.customId.length - 6,
					interaction.customId.length
				);
				const command = interaction.customId.substring(0, interaction.customId.length - 6);

				if (commandType == "Player")
					require(`../../commands/music/subcommands/${command}`)(this.client, interaction);
			}
		}
		if (interaction.isChatInputCommand()) {
			const command = this.client.commands.find(cmd => cmd.name === interaction.commandName);

			if (command) command.run(interaction);
		}
	};
};

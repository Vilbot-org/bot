const Event = require("../../structures/Event");

module.exports = class extends Event {
	constructor(client) {
		super(client, { name: "interactionCreate" });
	}

	run = interaction => {
		if (interaction.isCommand()) {
			const command = this.client.commands.find(cmd => cmd.name === interaction.commandName);

			if (command) command.run(interaction);
		}
	};
};

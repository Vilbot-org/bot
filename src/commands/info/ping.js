const Command = require("../../structures/Command");

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: "ping",
			description: "Replies with Pong!",
		});
	}

	run = interaction => {
		interaction.reply(`The ping of the bot are ${this.client.ws.ping}ms`);
		/* interaction.reply({
			content: `The ping of the bot are: ${this.client.ws.ping}ms`,
			ephemeral: true,
		}); */
	};
};

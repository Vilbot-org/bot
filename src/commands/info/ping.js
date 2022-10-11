const { EmbedBuilder } = require("discord.js");
const Command = require("../../structures/Command");

const { colors } = require("../../config.json");

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: "ping",
			description: "Replies with the ping of the bot!",
		});
	}

	run = async interaction => {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.green)
					.setAuthor({ name: "Pong!" })
					.setTitle(":ping_pong: The ping of the bot are" + "`" + `${this.client.ws.ping}` + "ms`"),
			],
		});
	};
};

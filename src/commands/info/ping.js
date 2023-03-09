import { EmbedBuilder } from "discord.js";
import Command from "../../structures/Command";

import config from "../../app.config";

export default class PingCommand extends Command {
	constructor(client) {
		super(client, { name: "ping", description: "Replies with the ping of the bot!" });
	}

	run = async interaction => {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.green)
					.setAuthor({ name: "Pong!" })
					.setTitle(":ping_pong: The ping of the bot are" + "`" + `${this.client.ws.ping}` + "ms`"),
			],
		});
	};
}

const { ActivityType } = require("discord.js");
const Event = require("../../structures/Event");

module.exports = class extends Event {
	constructor(client) {
		super(client, { name: "ready" });
	}

	run = async () => {
		console.log(`${this.client.user.tag} are ready`);
		//Register the status of the bot
		this.client.user.setActivity("/help", { type: ActivityType.Listening });

		this.client.registerCommands();
		await this.client.databaseConnection();
	};
};

const Event = require("../../structures/Event");

module.exports = class extends Event {
	constructor(client) {
		super(client, { name: "ready" });
	}

	run = () => {
		console.log(`${this.client.user.tag} are ready`);
		this.client.registerCommands();
	};
};

const Event = require("../../structures/Event");

const { botName } = require("../../../config.json");

module.exports = class extends Event {
	constructor(client) {
		super(client, { name: "messageCreate" });
	}

	run = async interaction => {
		//If the user send a message in the music boy channel and this message is not a command
		if (
			interaction.channel.name == `「🎵」${botName.charAt(0).toLowerCase() + botName.slice(1)}-music` &&
			interaction.member.user.id != this.client.user.id
		)
			await require("../../functions/exclusiveChannel")(this.client, interaction);
	};
};

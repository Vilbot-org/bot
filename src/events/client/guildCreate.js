const { ChannelType } = require("discord.js");
const Event = require("../../structures/Event");

module.exports = class extends Event {
	constructor(client) {
		super(client, { name: "guildCreate" });
	}

	run = async guild => {
		let channelToSend;

		guild.channels.forEach(channel => {
			if (channel.type == ChannelType.GuildText) {
				channelToSend = channel;
			}
		});

		if (!channelToSend) return;

		channelToSend.send("xd");
	};
};

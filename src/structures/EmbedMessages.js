const { EmbedBuilder } = require("discord.js");
const configs = require("../../config.json");

module.exports = (message, type) => {
	const embed = new EmbedBuilder();

	embed.setTitle(message.title);
	embed.setDescription(message.description);
	embed.setThumbnail(message.image);
	embed.setColor(configs.colors[type]);

	return embed;
};

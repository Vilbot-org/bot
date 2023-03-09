import { EmbedBuilder } from "discord.js";

import config from "../app.config";

module.exports = async (client, interaction) => {
	//Notify to the user and delete the message
	const interactionReply = await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.danger)
				.setTitle(":x: You can't send that message on this channel!")
				.setDescription(
					"This channel is exclusive for music commands, use another channel to send messages!"
				),
		],
	});
	await interaction.delete();

	setTimeout(() => {
		interactionReply.delete();
	}, 6000);
};

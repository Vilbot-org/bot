import { EmbedBuilder } from "discord.js";
import config from "../../../app.config";

export default async (client, interaction, queue) => {
	if (!queue)
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle(":x: Music in not playing!")],
			ephemeral: true,
		});

	try {
		const paused = await queue.node.pause();

		if (!paused)
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.info)
						.setTitle(":pause_button: The music is already paused!"),
				],
			});

		return await interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(config.colors.success).setTitle(":pause_button: The music has paused!"),
			],
		});
	} catch (e) {
		return await interaction.reply(`Something went wrong: ${e}`);
	}
};

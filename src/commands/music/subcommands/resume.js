import { EmbedBuilder } from "discord.js";
import config from "../../../app.config";

export default async (client, interaction, queue) => {
	if (!queue)
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle(":x: Music in not playing!")],
			ephemeral: true,
		});

	try {
		const isPaused = await queue.node.isPaused();

		if (!isPaused)
			return await interaction.reply({
				embeds: [new EmbedBuilder().setColor(config.colors.danger).setTitle(":x: Music in not paused!")],
				ephemeral: true,
			});

		await queue.node.resume();
		return await interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(config.colors.success).setTitle(":arrow_forward: Resume the music!"),
			],
		});
	} catch (e) {
		return interaction.followUp(`Something went wrong: ${e}`);
	}
};

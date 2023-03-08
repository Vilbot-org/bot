const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../../config.json");

module.exports = async (client, interaction, queue) => {
	if (!queue)
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Music in not playing!")],
			ephemeral: true,
		});

	try {
		const isPaused = await queue.node.isPaused();

		if (!isPaused)
			return await interaction.reply({
				embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Music in not paused!")],
				ephemeral: true,
			});

		await queue.node.resume();
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.success).setTitle(":arrow_forward: Resume the music!")],
		});
	} catch (e) {
		return interaction.followUp(`Something went wrong: ${e}`);
	}
};

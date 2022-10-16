const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../../config.json");

module.exports = async (client, interaction) => {
	const queue = await client.player.getQueue(interaction.guildId);

	if (!queue)
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Music in not playing!")],
			ephemeral: true,
		});

	if (!(await queue.connection.paused))
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Music in not paused!")],
			ephemeral: true,
		});

	await queue.setPaused(false);
	return await interaction.reply({
		embeds: [new EmbedBuilder().setColor(colors.success).setTitle(":arrow_forward: Resume the music!")],
	});
};

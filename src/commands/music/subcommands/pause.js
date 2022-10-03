const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../../../config.json");

module.exports = async (client, interaction) => {
	const queue = await client.player.getQueue(interaction.guildId);

	if (!queue)
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Music in not playing!")],
			ephemeral: true,
		});

	await queue.setPaused(true);
	return await interaction.reply({
		embeds: [new EmbedBuilder().setColor(colors.success).setTitle(":pause_button: The music has paused!")],
	});
};

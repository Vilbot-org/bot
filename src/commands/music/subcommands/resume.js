const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../../../config.json");

module.exports = (client, interaction) => {
	const queue = client.player.getQueue(interaction.guildId);

	if (!queue)
		return interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Music in not playing!")],
			ephemeral: true,
		});

	if (!queue.connection.paused)
		return interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Music in not paused!")],
			ephemeral: true,
		});

	queue.setPaused(false);
	return interaction.reply({
		embeds: [new EmbedBuilder().setColor(colors.success).setTitle(":arrow_forward: Resume the music!")],
	});
};

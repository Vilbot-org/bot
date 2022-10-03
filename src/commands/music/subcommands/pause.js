const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../../../config.json");

module.exports = (client, interaction) => {
	const queue = client.player.getQueue(interaction.guildId);

	if (!queue)
		return interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Music in not playing!")],
			ephemeral: true,
		});

	queue.setPaused(true);
	return interaction.reply({
		embeds: [new EmbedBuilder().setColor(colors.success).setTitle(":pause_button: The music has paused!")],
	});
};

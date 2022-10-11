const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { colors } = require("../../../config.json");

module.exports = async (client, interaction) => {
	const queue = await client.player.getQueue(interaction.guildId);

	if (!queue)
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Music in not playing!")],
			ephemeral: true,
		});

	//Check if the user can moderate
	if (interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
		await queue.destroy();
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.success)
					.setTitle(":wave: The bot has been disconnected!")
					.setDescription("Bye, bye!"),
			],
		});
	} else
		return await interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(colors.danger).setTitle(":x: You don't have permission to do that!"),
			],
			ephemeral: true,
		});
};

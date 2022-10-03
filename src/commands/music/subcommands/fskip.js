const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const { colors } = require("../../../../config.json");

module.exports = async (client, interaction) => {
	const embedMsg = new EmbedBuilder().setTitle("Music queue!");

	const queue = await client.player.getQueue(interaction.guildId);

	if (!queue || !queue.playing) {
		embedMsg.setColor(colors.danger).setDescription(":x: No songs in the queue!");

		return await interaction.reply({
			embeds: [embedMsg],
			ephemeral: true,
		});
	}

	//Check if the user can moderate
	if (interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
		const skipingMessage = new EmbedBuilder()
			.setColor(colors.success)
			.setTitle(":track_next: Forcing the skip of the song")
			.setDescription(
				queue.tracks.length > 0
					? `The next song is ${queue.tracks[0].title}`
					: "There are no more songs in the queue!"
			);

		queue.skip();

		return await interaction.reply({
			embeds: [skipingMessage],
			ephemeral: true,
		});
	} else {
		return await interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(colors.danger).setTitle(":x: You don't have permission to do that!"),
			],
			ephemeral: true,
		});
	}
};

const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../../config.json");

module.exports = async (client, interaction, queue) => {
	if (!queue)
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Music is not playing!")],
			ephemeral: true,
		});

	const progressBar = await queue.node.createProgressBar({
		queue: false,
		length: 20,
	});

	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.success)
				.setAuthor({ name: "Current song info" })
				.setTitle(`${queue.currentTrack.title}`)
				.setURL(`${queue.currentTrack.url}`)
				.setDescription(progressBar + "\n" + "Progress bar")
				.setThumbnail(`${queue.currentTrack.thumbnail}`),
		],
	});
};

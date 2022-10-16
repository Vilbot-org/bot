const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../../config.json");

module.exports = async (client, interaction) => {
	const queue = await client.player.getQueue(interaction.guildId);

	if (!queue)
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: Music is not playing!")],
			ephemeral: true,
		});

	const progressBar = await queue.createProgressBar({
		queue: false,
		length: 20,
	});
	const currentSong = queue.current;

	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.success)
				.setAuthor({ name: "Current song info" })
				.setTitle(`${currentSong.title}`)
				.setURL(`${currentSong.url}`)
				.setDescription(progressBar + "\n" + "Progress bar")
				.setThumbnail(`${currentSong.thumbnail}`),
		],
	});
};

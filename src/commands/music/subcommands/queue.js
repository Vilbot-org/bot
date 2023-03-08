const { EmbedBuilder } = require("discord.js");

const { colors } = require("../../../config.json");

module.exports = async (client, interaction, queue) => {
	const embedMsg = new EmbedBuilder().setAuthor({ name: "Music queue!" }).setTitle("Current song:");

	if (!queue)
		return await interaction.reply({
			embeds: [embedMsg.setColor(colors.danger).setDescription(":x: No songs in the queue!")],
			ephemeral: true,
		});

	try {
		embedMsg
			.setColor(colors.success)
			.setThumbnail(queue.currentTrack.thumbnail)
			.setDescription(`[${queue.currentTrack.title}](${queue.currentTrack.url})`)
			.setFooter({ text: `There are ${queue.getSize()} songs in the queue` });

		if (!queue.isEmpty())
			embedMsg.addFields(
				queue.tracks.map((track, key) => ({
					name: `${key + 1}. ${track.title}`,
					value: "\u200B",
					inline: true,
				}))
			);

		return await interaction.reply({
			embeds: [embedMsg],
		});
	} catch (e) {
		return await interaction.reply(`Something went wrong: ${e}`);
	}
};

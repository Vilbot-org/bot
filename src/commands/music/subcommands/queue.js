const { EmbedBuilder } = require("discord.js");

const { colors } = require("../../../config.json");

module.exports = async (client, interaction) => {
	const embedMsg = new EmbedBuilder().setAuthor({ name: "Music queue!" }).setTitle("Current song:");

	const queue = await client.player.getQueue(interaction.guildId);

	if (!queue || !queue.playing)
		return await interaction.reply({
			embeds: [embedMsg.setColor(colors.danger).setDescription(":x: No songs in the queue!")],
			ephemeral: true,
		});

	const currentSong = queue.current;

	embedMsg
		.setColor(colors.success)
		.setThumbnail(currentSong.thumbnail)
		.setDescription(`[${currentSong.title}](${currentSong.url})`);

	let embedFields = [];
	let queuePosition = 0;
	for (const track of queue.tracks) {
		let queueSong = {
			name: `${++queuePosition}. ${track.title}`,
			value: "\u200B",
			inline: true,
		};

		embedFields.push(queueSong);
	}

	embedMsg.addFields(embedFields).setFooter({ text: `There are ${queue.tracks.length} songs in the queue` });

	return await interaction.reply({
		embeds: [embedMsg],
	});
};

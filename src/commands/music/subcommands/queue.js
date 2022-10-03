const { EmbedBuilder } = require("discord.js");

const configs = require("../../../../config.json");

module.exports = async (client, interaction) => {
	const embedMsg = new EmbedBuilder().setTitle("Music queue!");

	const queue = await client.player.getQueue(interaction.guildId);

	if (!queue || !queue.playing) {
		embedMsg.setColor(configs.colors.danger).setDescription(":x: No songs in the queue!");

		return await interaction.reply({
			embeds: [embedMsg],
		});
	}

	const currentSong = queue.current;

	embedMsg.setColor(configs.colors.success).setThumbnail(currentSong.thumbnail);

	let embedFields = [
		{ name: "Current song: ", value: `${currentSong.title}` },
		{ name: "Queue", value: "\u200B" },
	];

	let auxIndex = 0;
	for (const track of queue.tracks) {
		let queueSong = {
			name: `${++auxIndex}. ${track.title}`,
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

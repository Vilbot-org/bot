const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../../../config.json");

module.exports = async (client, interaction, snipe) => {
	const playlistName = interaction.options.getString("name")
		? interaction.options.getString("name")
		: `${interaction.user.username}-playlist`;

	//Check if this playlist already exist
	const data = await snipe.findOne({ userId: interaction.user.id, playlistName: playlistName });
	if (!data)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.danger)
					.setTitle(":x: You don't have playlist with that name!")
					.setDescription(
						"Please check the name and try again or create a playlist with that name typing `/playlist create " +
							playlistName +
							"`."
					),
			],
			ephemeral: true,
		});

	const embedMsg = new EmbedBuilder()
		.setColor(colors.success)
		.setAuthor({ name: "Songs list" })
		.setTitle(data.playlistName);

	if (data.playlist.length > 0) {
		const embedFields = [];
		for (const [i, playlist] of data.playlist.entries()) {
			embedFields.push({
				name: `${i + 1}. `,
				value: `[${playlist.title}](${playlist.url})`,
			});
		}
		embedMsg.addFields(embedFields);
	}

	return await interaction.reply({
		embeds: [
			embedMsg.setDescription(`This playlist have ${data.playlist.length} songs`).setFooter({
				text:
					data.playlist.length > 0
						? "Type `/music playlist " + playlistName + "` to play your playlist."
						: "Type `/playlist add <song> " + playlistName + "` to add new songs to  your playlist.",
			}),
		],
		ephemeral: true,
	});
};

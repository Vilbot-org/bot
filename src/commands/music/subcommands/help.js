const { EmbedBuilder } = require("discord.js");
const { botName, siteURL, colors } = require("../../../config.json");

module.exports = async (client, interaction) => {
	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.info)
				.setTitle(`${botName} music help`)
				.setDescription("Main command list:")
				.addFields(
					{
						name: "Play your favorite songs in the voice channel.",
						value: "`/music play <song name or url>`",
					},
					{
						name: "Play your favorite playlist in the voice channel.",
						value: "`/music playlist <url>`",
					},
					{
						name: "Display the info of the currently playin song.",
						value: "`/music info`",
					},
					{
						name: "Display queue of the bot.",
						value: "`/music queue`",
					},
					{
						name: "Init the votation to skip the currently playing song.",
						value: "`/music skip`",
					},
					{
						name: "All the commands",
						value:
							"To view the full list of music commands type `/music` or visit the [oficial site](" +
							siteURL +
							").",
					}
				)
				.setFooter({
					text: botName,
				})
				.setThumbnail(client.user.avatarURL()),
		],
	});
};

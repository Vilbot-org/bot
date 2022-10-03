const { EmbedBuilder } = require("discord.js");
const { colors, siteURL } = require("../../../../../config.json");

module.exports = async interaction => {
	const musicChannel = await interaction.guild.channels
		.create({
			name: "vilbot-music",
			rateLimitPerUser: 30,
			reason: "Channel to view the music in your channel!",
		})
		.catch(console.error);
	//If the channel could not be created it sends an error
	if (!musicChannel)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.danger)
					.setTitle(":x: An error occurred while creating the channel")
					.setDescription("Check the permissions and try again."),
			],
			ephimeral: true,
		});

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.green)
				.setTitle(":white_check_mark: New channel create with successful!")
				.setDescription(
					`View the [official site](${siteURL}) of the bot or execute` + "`/help` command to show more info."
				),
		],
	});

	musicChannel.send("Este es un mensage!");
};

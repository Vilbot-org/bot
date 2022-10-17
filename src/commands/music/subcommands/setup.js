const { ButtonBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");

const { botName, colors, siteURL } = require("../../../config.json");

module.exports = async (client, interaction) => {
	//Check if the user can moderate
	if (
		!interaction.member.permissions.has(
			PermissionsBitField.Flags.ModerateMembers | PermissionsBitField.Flags.ManageChannels
		)
	)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(colors.danger).setTitle(":x: You don't have permission to do that!"),
			],
			ephemeral: true,
		});

	const channels = await interaction.guild.channels.fetch();

	const existChannel = channels.find(element => {
		return element.name == `「🎵」${botName.charAt(0).toLowerCase() + botName.slice(1)}-music`;
	});
	//If the channel exist
	if (existChannel)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.danger)
					.setTitle(":x: The channel already exists!")
					.setDescription(
						`If you want to reset the bot channel please delete the '${botName}-music' text channel and run this command again.`
					),
			],
			ephemeral: true,
		});

	const musicChannel = await interaction.guild.channels
		.create({
			name: `「🎵」${botName}-music`,
			topic:
				"Hi! This is the channel text of the music bot, in this channel you can running the commands of the bot to have your server more organized.\nTo view all the music commands run **/music help** or to view all the commands run: **/help**",
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
			ephemeral: true,
		});

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.green)
				.setTitle(":white_check_mark: New channel create with successful!")
				.setDescription(
					`View the [official site](${siteURL}) of the bot or execute` +
						"`/help` or `/music help` command to show more info."
				),
		],
	});

	const quickControls = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder().setCustomId("previousPlayer").setEmoji({ name: "⏮️" }).setStyle(ButtonStyle.Primary)
		)
		.addComponents(
			new ButtonBuilder().setCustomId("pausePlayer").setEmoji({ name: "⏸️" }).setStyle(ButtonStyle.Primary)
		)
		.addComponents(
			new ButtonBuilder().setCustomId("resumePlayer").setEmoji({ name: "▶" }).setStyle(ButtonStyle.Primary)
		)
		.addComponents(
			new ButtonBuilder().setCustomId("skipPlayer").setEmoji({ name: "⏭️" }).setStyle(ButtonStyle.Primary)
		);
	const playerInfoControls = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder().setCustomId("queuePlayer").setLabel("Queue").setStyle(ButtonStyle.Success)
		)
		.addComponents(
			new ButtonBuilder().setCustomId("infoPlayer").setLabel("Info").setStyle(ButtonStyle.Success)
		)
		.addComponents(
			new ButtonBuilder().setCustomId("quitPlayer").setLabel("Quit").setStyle(ButtonStyle.Danger)
		);
	await musicChannel
		.send({
			content: "Quick controls for music",
			components: [quickControls, playerInfoControls],
		})
		.then(msg => msg.pin());
};

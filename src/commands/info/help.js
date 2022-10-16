const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Command = require("../../structures/Command");

const { botName, colors, siteURL } = require("../../config.json");

module.exports = class extends Command {
	constructor(client) {
		super(
			client,
			new SlashCommandBuilder().setName("help").setDescription("Display more information about the bot!")
		);
	}

	run = async interaction => {
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.info)
					.setTitle(`${botName} help`)
					.setThumbnail(this.client.user.avatarURL())
					.setAuthor({ name: "Vilbot help command" })
					.setDescription(`Hi! I'm ${botName} a awesome discord bot.`)
					.addFields(
						{
							name: "Full command list",
							value:
								"To view full commands list type `/` or visit the [oficial site](" +
								siteURL +
								") to view a detailed description of all commands.",
						},
						{ name: "Categories", value: "\u200B" },
						{
							name: "Music commands",
							value:
								"I have a cool music player.\n `/music play` to start to listen music.\n`/music help` to display more info.",
							inline: true,
						},
						{
							name: "Info commands",
							value:
								"Useful commands with information about me.\n `/ping` to see the ping of the bot\n`/help` to show more info about me.",
						},
						{
							name: "LoL commands",
							value:
								"Commands to view League of Legends info.\n`/lol stats` to view a stats of a specific summoner.\n`/lol help` to display more info.",
							inline: true,
						},
						{
							name: "Utils commands",
							value: "Usefull commands.\n`/clear` to clear the bot messages.",
							inline: true,
						}
					)
					.setFooter({ text: `${siteURL} by GFrancv` }),
			],
		});
	};
};

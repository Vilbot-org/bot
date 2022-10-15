const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const Command = require("../../structures/Command");

const { colors } = require("../../config.json");

module.exports = class extends Command {
	constructor(client) {
		super(
			client,
			new SlashCommandBuilder()
				.setName("clear")
				.setDescription("Remove messages from the bot on this channel!")
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
				.addNumberOption(option =>
					option
						.setName("amount")
						.setDescription(
							"Number of bot messages you want to delete (by defaul the command clear 10 messages)."
						)
						.setRequired(false)
				)
		);
	}

	run = async interaction => {
		const amountOfMessages = interaction.options.getInteger("amount")
			? interaction.options.getInteger("amount")
			: 10;
		let allMsgs = [];
		let msgsToDelete = [];

		await interaction.channel.messages
			.fetch({ limit: amountOfMessages, cache: false })
			.then(messages => (allMsgs = messages))
			.catch(console.error);

		allMsgs.map(msg => {
			if (msg.author.id == this.client.user.id && !msg.pinned) msgsToDelete.push(msg);
		});

		if (msgsToDelete.length == 0) {
			return await interaction.reply({
				embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(`:x: There are no messages to delete!`)],
				ephemeral: true,
			});
		}

		await interaction.channel.bulkDelete(msgsToDelete);
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.success)
					.setTitle(`:white_check_mark: ${msgsToDelete.length} messages have been successfully deleted!`),
			],
			ephemeral: true,
		});
	};
};

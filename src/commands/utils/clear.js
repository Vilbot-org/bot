import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder
} from 'discord.js';
import Command from '../../structures/Command';

import config from '../../app.config';

export default class extends Command {
	constructor(client) {
		super(
			client,
			new SlashCommandBuilder()
				.setName('clear')
				.setDescription('Remove messages from the bot on this channel!')
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		);
	}

	run = async (interaction) => {
		const amountOfMessages = 10;
		let allMsgs = [];
		const msgsToDelete = [];

		await interaction.channel.messages
			.fetch({ limit: amountOfMessages, cache: false })
			.then((messages) => {
				allMsgs = messages;
			})
			.catch(console.error);

		allMsgs.forEach((msg) => {
			if (msg.author.id === this.client.user.id && !msg.pinned)
				msgsToDelete.push(msg);
		});

		if (msgsToDelete.length === 0) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.danger)
						.setTitle(`:x: There are no messages to delete!`)
				],
				ephemeral: true
			});
		}

		await interaction.channel.bulkDelete(msgsToDelete);
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.success)
					.setTitle(
						`:white_check_mark: ${msgsToDelete.length} messages have been successfully deleted!`
					)
			],
			ephemeral: true
		});
	};
}

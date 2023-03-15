import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder
} from 'discord.js';

import config from '../../app.config';

export default {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Remove messages from the bot on this channel!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

	async execute(interaction) {
		const amountOfMessages = 10;

		const allMsgs = await interaction.channel.messages.fetch({
			limit: amountOfMessages,
			cache: false
		});

		console.log(allMsgs);

		const msgsToDelete = allMsgs.filter(
			(msg) => msg.author.id === interaction.client.user.id && !msg.pinned
		);

		if (msgsToDelete.size === 0) {
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.info)
						.setTitle(`There are no messages to delete!`)
				],
				ephemeral: true
			});
			return;
		}

		await interaction.channel.bulkDelete(msgsToDelete);
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.success)
					.setTitle(
						`:white_check_mark: ${msgsToDelete.size} messages have been successfully deleted!`
					)
			],
			ephemeral: true
		});
	}
};

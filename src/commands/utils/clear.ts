import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
	TextChannel
} from 'discord.js';

import config from '../../app.config';
import Command from '@/classes/Command';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const amountOfMessages = 10;

	const allMsgs = await interaction.channel?.messages.fetch({
		limit: amountOfMessages,
		cache: false
	});

	const msgsToDelete = allMsgs?.filter(
		(msg) => msg.author.id === interaction.client.user.id && !msg.pinned
	);

	if (msgsToDelete?.size === 0 || !msgsToDelete) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.info)
					.setTitle('There are no messages to delete!')
			],
			ephemeral: true
		});
		return;
	}

	const channel = interaction.channel as TextChannel;
	await channel.bulkDelete(msgsToDelete);
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
};

const clearCommandOptions = {
	name: 'clear',
	description: 'Remove messages from the bot on this channel!',
	execute: execute,
	permissions: [PermissionFlagsBits.ManageMessages]
};
const clearCommand = new Command(clearCommandOptions);

export default clearCommand;

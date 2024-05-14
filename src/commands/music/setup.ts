import { ButtonBuilder } from '@discordjs/builders';
import {
	ActionRowBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits
} from 'discord.js';

import MusicError from '@/errors/MusicError';
import Command from '@/classes/Command';
import config from '@/app.config';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const channels = await interaction.guild?.channels.fetch();

	const existChannel = channels?.find(
		(element) =>
			element?.name ===
			`「🎵」${
				config.botName.charAt(0).toLowerCase() + config.botName.slice(1)
			}-music`
	);

	// If the channel exist
	if (existChannel) {
		throw new MusicError(
			'The channel already exists!',
			`If you want to reset the bot channel please delete the '${config.botName}-music' text channel and run this command again.`
		);
	}

	const musicChannel = await interaction.guild?.channels.create({
		name: `「🎵」${config.botName}-music`,
		topic:
			'Hi! This is the channel text of the music bot, in this channel you can running the commands of the bot to have your server more organized.\nTo view all the music commands run **/music help** or to view all the commands run: **/help**',
		rateLimitPerUser: 30,
		reason: 'Channel to view the music in your channel!'
	});

	if (!musicChannel) {
		throw new MusicError(
			'An error occurred while creating the channel!',
			'Check the permissions and try again.'
		);
	}

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.green)
				.setTitle(':white_check_mark: New channel create with successful!')
				.setDescription(
					`View the [official site](${config.siteURL}) of the bot or execute` +
						'`/help` or `/music help` command to show more info.'
				)
		]
	});

	const quickControls = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('pausePlayer')
				.setEmoji({ name: '⏸️' })
				.setStyle(ButtonStyle.Primary)
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId('resumePlayer')
				.setEmoji({ name: '▶' })
				.setStyle(ButtonStyle.Primary)
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId('skipPlayer')
				.setEmoji({ name: '⏭️' })
				.setStyle(ButtonStyle.Primary)
		);
	const playerInfoControls = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('queuePlayer')
				.setLabel('Queue')
				.setStyle(ButtonStyle.Success)
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId('infoPlayer')
				.setLabel('Info')
				.setStyle(ButtonStyle.Success)
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId('quitPlayer')
				.setLabel('Quit')
				.setStyle(ButtonStyle.Danger)
		);

	await musicChannel
		.send({
			content: 'Quick controls for music',
			components: [quickControls, playerInfoControls]
		})
		.then((msg) => msg.pin());
};

const setupCommandOptions = {
	name: 'setup',
	description: 'Run this command to setup the bot!',
	execute: execute,
	permissions: [PermissionFlagsBits.ManageGuild]
};
const setupCommand = new Command(setupCommandOptions);

export default setupCommand;

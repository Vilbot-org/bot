import { ButtonBuilder } from '@discordjs/builders';
import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonStyle,
	PermissionsBitField
} from 'discord.js';

import config from '../../../app.config';

export default async (interaction) => {
	if (
		!interaction.member.permissions.has(
			PermissionsBitField.Flags.ModerateMembers
		)
	)
		throw new Error('no-permission');

	const channels = await interaction.guild.channels.fetch();

	const existChannel = channels.find(
		(element) =>
			element.name ===
			`「🎵」${
				config.botName.charAt(0).toLowerCase() + config.botName.slice(1)
			}-music`
	);

	//If the channel exist
	if (existChannel) throw new Error('channel-already-exist');

	const musicChannel = await interaction.guild.channels.create({
		name: `「🎵」${config.botName}-music`,
		topic:
			'Hi! This is the channel text of the music bot, in this channel you can running the commands of the bot to have your server more organized.\nTo view all the music commands run **/music help** or to view all the commands run: **/help**',
		rateLimitPerUser: 30,
		reason: 'Channel to view the music in your channel!'
	});

	if (!musicChannel) throw new Error('creating-channel');

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

	const quickControls = new ActionRowBuilder()
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
	const playerInfoControls = new ActionRowBuilder()
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
	return musicChannel
		.send({
			content: 'Quick controls for music',
			components: [quickControls, playerInfoControls]
		})
		.then((msg) => msg.pin());
};

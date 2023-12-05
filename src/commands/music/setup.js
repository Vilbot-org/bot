import { ButtonBuilder, SlashCommandBuilder } from '@discordjs/builders';
import {
	ActionRowBuilder,
	ButtonStyle,
	EmbedBuilder,
	PermissionsBitField
} from 'discord.js';

import config from '@/app.config';
import MusicErrors from '@/errors/MusicErrors';

export default {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Run this command to setup the bot!'),

	async execute(interaction) {
		if (
			!interaction.member.permissions.has(
				PermissionsBitField.Flags.ModerateMembers
			)
		) {
			throw new MusicErrors(
				'No permissions',
				'You dont have permissions to exec this command.'
			);
		}

		const channels = await interaction.guild.channels.fetch();

		const existChannel = channels.find(
			(element) =>
				element.name ===
				`「🎵」${
					config.botName.charAt(0).toLowerCase() + config.botName.slice(1)
				}-music`
		);

		// If the channel exist
		if (existChannel) {
			throw new MusicErrors(
				'The channel already exists!',
				`If you want to reset the bot channel please delete the '${config.botName}-music' text channel and run this command again.`
			);
		}

		const musicChannel = await interaction.guild.channels.create({
			name: `「🎵」${config.botName}-music`,
			topic:
				'Hi! This is the channel text of the music bot, in this channel you can running the commands of the bot to have your server more organized.\nTo view all the music commands run **/music help** or to view all the commands run: **/help**',
			rateLimitPerUser: 30,
			reason: 'Channel to view the music in your channel!'
		});

		if (!musicChannel) {
			throw new MusicErrors(
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
	}
};

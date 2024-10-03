import { ChatInputCommandInteraction } from 'discord.js';

import { version as appVersion, author } from '../../../package.json';
import Command from '@/classes/Command';
import type { ICommandOptions } from '@/types/IBot';
import musicHelpSubCommand from './subcommands/music';
import playlistHelpSubCommand from './subcommands/playlist';
import appConfig from '@/app.config';
import { EmbedBuilder } from '@discordjs/builders';

const execute = async (interaction: ChatInputCommandInteraction) => {
	try {
		if (interaction.options.getSubcommand() === 'music') {
			await musicHelpSubCommand(interaction);
		} else if (interaction.options.getSubcommand() === 'playlist') {
			await playlistHelpSubCommand(interaction);
		}
	} catch {
		const botName = interaction.client.user.username;

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(appConfig.colors.info)
					.setThumbnail(interaction.client.user.avatarURL())
					.setDescription(
						`
            **${botName} help**
            Hi! I'm ${botName} a awesome discord music bot for your server. Current version: \`v${appVersion}\``
					)
					.addFields(
						{
							name: 'Full command list',
							value: `To view full commands list type \`/\` or visit the [oficial site](${appConfig.siteURL}) to view a detailed description of all commands.`
						},
						{
							name: 'Music commands',
							value:
								'Music commands list\n `/play` to start to listen music.\n`/music help` to display more info.',
							inline: true
						},
						{
							name: 'Info commands',
							value:
								'Useful commands with information about the bot.\n `/ping` to see the ping of the bot.'
						},
						{
							name: 'Utils commands',
							value: 'Usefull commands.\n`/clear` to clear the bot messages.'
						}
					)
					.setFooter({
						text: `${botName} by ${author}`
					})
			]
		});
	}
};

const helpCommandOptions: ICommandOptions = {
	name: 'help',
	description: 'Display more information about the bot!',
	execute: execute,
	subcommands: [
		{
			name: 'music',
			description: 'Display more information about the music commands!'
		},
		{
			name: 'playlist',
			description: 'Display more information about the playlist commands!'
		}
	]
};
const helpCommand = new Command(helpCommandOptions);

export default helpCommand;

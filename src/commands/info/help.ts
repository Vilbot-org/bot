import { version as appVersion } from '../../../package.json';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import appConfig from '@/app.config';
import Command from '@/classes/Command';

const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(appConfig.colors.info)
				.setTitle(`${appConfig.botName} help`)
				.setThumbnail(interaction.client.user.avatarURL())
				.setAuthor({ name: `${appConfig.botName} help command` })
				.setDescription(
					`Hi! I'm ${appConfig.botName} a awesome discord bot. Current version: \`v${appVersion}\``
				)
				.addFields(
					{
						name: 'Full command list',
						value:
							'To view full commands list type `/` or visit the [oficial site](https://gfrancv.com) to view a detailed description of all commands.'
					},
					{ name: 'Categories', value: '\u200B' },
					{
						name: 'Music commands',
						value:
							'I have a cool music player.\n `/music play` to start to listen music.\n`/music help` to display more info.',
						inline: true
					},
					{
						name: 'Info commands',
						value:
							'Useful commands with information about me.\n `/ping` to see the ping of the bot\n`/help` to show more info about me.'
					},
					{
						name: 'Utils commands',
						value: 'Usefull commands.\n`/clear` to clear the bot messages.',
						inline: true
					}
				)
				.setFooter({
					text: `${appConfig.botName} by ${appConfig.author}`
				})
		]
	});
};

const helpCommandOptions = {
	name: 'help',
	description: 'Display more information about the bot!',
	execute: execute
};
const helpCommand = new Command(helpCommandOptions);

export default helpCommand;

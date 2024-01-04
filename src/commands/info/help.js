import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import config from '@/app.config';

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Display more information about the bot!'),

	async execute(interaction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.info)
					.setTitle(`${config.botName} help`)
					.setThumbnail(interaction.client.user.avatarURL())
					.setAuthor({ name: 'Vilbot help command' })
					.setDescription(
						`Hi! I'm ${config.botName} a awesome discord bot. Current version: \`v${config.version}\``
					)
					.addFields(
						{
							name: 'Full command list',
							value: `To view full commands list type \`/\` or visit the [oficial site](${config.siteURL}) to view a detailed description of all commands.`
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
					.setFooter({ text: `${config.siteURL} by ${config.author}` })
			]
		});
	}
};

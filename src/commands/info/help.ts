import Command from '@/classes/Command';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(0x01feff)
				.setTitle('Bot help')
				.setThumbnail(interaction.client.user.avatarURL())
				.setAuthor({ name: 'Vilbot help command' })
				.setDescription('test')
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
				.setFooter({ text: 'test by GFrancV' })
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

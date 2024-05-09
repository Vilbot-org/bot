import { EmbedBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

import Command from '@/classes/Command';

const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(0x01feff)
				.setTitle('Pong!')
				.setDescription(
					`:ping_pong: The ping of the bot are \`${interaction.client.ws.ping}ms\``
				)
		],
		ephemeral: true
	});
};

const pingCommandOptions = {
	name: 'ping',
	description: 'Replies with the ping of the bot!',
	execute: execute
};
const pingCommand = new Command(pingCommandOptions);
export default pingCommand;

import { EmbedBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

import Command from '@/classes/Command';
import appConfig from '@/app.config';

const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({
		embeds: [
			new EmbedBuilder().setColor(appConfig.colors.info).setDescription(
				`
          **Ping**
          :ping_pong: Ping \`${interaction.client.ws.ping}ms\``
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

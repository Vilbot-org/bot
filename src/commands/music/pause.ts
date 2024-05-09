import appConfig from '@/app.config';
import Command from '@/classes/Command';
import { getVoiceChannel } from '@/utils/guildUtils';
import { pause } from '@/utils/musicUtils';
import { EmbedBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);

	pause(voiceChannel);

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(appConfig.colors.success)
				.setTitle(':pause_button: The music has paused!')
		]
	});
};

const pauseCommandOptions = {
	name: 'pause',
	description: 'Pause the music!',
	execute: execute
};
const pauseCommand = new Command(pauseCommandOptions);

export default pauseCommand;

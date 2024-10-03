import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import Command from '@/classes/Command';
import { resume } from '@/utils/musicUtils';
import { getVoiceChannel } from '@/utils/guildUtils';
import { getEmoji } from '@/common/utils/EmojiHelper';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);

	resume(voiceChannel);

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setTitle(`${getEmoji('playing')} **Music resumed!**`)
		]
	});
};

const resumeCommandOptions = {
	name: 'resume',
	description: 'Resume the music!',
	execute: execute
};
const resumeCommand = new Command(resumeCommandOptions);

export default resumeCommand;

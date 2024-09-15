import appConfig from '@/app.config';
import Command from '@/classes/Command';
import { getEmoji } from '@/common/utils/EmojiHelper';
import { getVoiceChannel } from '@/utils/guildUtils';
import { pause } from '@/utils/musicUtils';
import { EmbedBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);

	pause(voiceChannel);

	const embed = new EmbedBuilder()
		.setColor(appConfig.colors.success)
		.setAuthor({
			name: interaction.user.username,
			iconURL: interaction.user.displayAvatarURL()
		})
		.setDescription(`${getEmoji('pause')} **Music paused!**`);

	await interaction.reply({
		embeds: [embed]
	});
};

const pauseCommandOptions = {
	name: 'pause',
	description: 'Pause the music!',
	execute: execute
};
const pauseCommand = new Command(pauseCommandOptions);

export default pauseCommand;

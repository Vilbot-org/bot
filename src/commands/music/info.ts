import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import { getQueue } from '@/utils/musicUtils';
import Command from '@/classes/Command';
import { getVoiceChannel } from '@/utils/guildUtils';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);

	const queue = getQueue(voiceChannel);

	const progressBar = queue.node.createProgressBar({
		queue: false,
		length: 20
	});

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setAuthor({ name: 'Current song info' })
				.setTitle(`${queue.currentTrack?.title}`)
				.setURL(`${queue.currentTrack?.url}`)
				.setDescription(`${progressBar}\nProgress bar`)
				.setThumbnail(`${queue.currentTrack?.thumbnail}`)
		]
	});
};

const infoMusicCommandOptions = {
	name: 'info',
	description: 'Info about the current song!',
	execute: execute
};
const infoMusicCommand = new Command(infoMusicCommandOptions);

export default infoMusicCommand;

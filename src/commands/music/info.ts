import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import { getQueue } from '@/utils/musicUtils';
import Command from '@/classes/Command';
import { getVoiceChannel } from '@/utils/guildUtils';
import { formatTrackTitleForEmbed } from '@/utils/interactions';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);

	const queue = getQueue(voiceChannel);

	const progressBar = queue.node.createProgressBar({
		queue: false,
		length: 12,
		timecodes: false
	});

	if (!queue.currentTrack) {
		return;
	}

	const embedDescription = `${formatTrackTitleForEmbed(queue.currentTrack)}
  \`${queue.node.getTimestamp()?.current.label}\` ${progressBar} \`${
		queue.node.getTimestamp()?.total.label
	}\``;

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setAuthor({ name: 'Current song info' })
				.setURL(`${queue.currentTrack?.url}`)
				.setDescription(`${embedDescription}`)
				.setThumbnail(`${queue.currentTrack?.thumbnail}`)
				.addFields(
					{
						name: 'Author',
						value: `${queue.currentTrack.author}`,
						inline: true
					},
					{
						name: 'Requested by',
						value: `<@${queue.currentTrack.requestedBy?.id}>`,
						inline: true
					}
				)
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

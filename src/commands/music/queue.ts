import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	formatEmoji
} from 'discord.js';

import config from '@/app.config';
import Command from '@/classes/Command';
import { getVoiceChannel } from '@/utils/guildUtils';
import { getQueue } from '@/utils/musicUtils';
import {
	formatDurationQueueForEmbed,
	formatTrackTitleForEmbed
} from '@/utils/interactions';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);

	const queue = getQueue(voiceChannel);
	const { currentTrack } = queue;

	let embedDescription = '';
	if (currentTrack) {
		embedDescription = `
    Now playing
    ${formatEmoji('1273955433299705877')} ${formatTrackTitleForEmbed(
			currentTrack
		)} 
    Requested by <@${currentTrack?.requestedBy?.id}>`;
	}

	if (!queue.isEmpty()) {
		let tracksStringList = '';
		queue.tracks.toArray().forEach((track, key) => {
			tracksStringList += `${key + 1}. ${formatTrackTitleForEmbed(track)} 
      Requested by <@${track.requestedBy?.id}>\n`;
		});

		embedDescription += `
    \n**Tracks in queue**
    ${tracksStringList}`;
	}

	const embedMsg = new EmbedBuilder()
		.setAuthor({ name: 'Music queue' })
		.setColor(config.colors.success)
		.setThumbnail(queue.currentTrack?.thumbnail ?? null)
		.setDescription(embedDescription)
		.setFooter({
			text: `${queue.getSize()} songs in the queue - Estimated duration: ${formatDurationQueueForEmbed(
				queue
			)}`
		});

	await interaction.reply({
		embeds: [embedMsg]
	});
};

const queueCommandOptions = {
	name: 'queue',
	description: 'See the queue of the bot!',
	execute: execute
};
const queueCommand = new Command(queueCommandOptions);

export default queueCommand;

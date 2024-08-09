import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import Command from '@/classes/Command';
import { getVoiceChannel } from '@/utils/guildUtils';
import { getQueue } from '@/utils/musicUtils';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);

	const queue = getQueue(voiceChannel);

	const embedMsg = new EmbedBuilder()
		.setAuthor({ name: 'Music queue!' })
		.setTitle('Current song:')
		.setColor(config.colors.success)
		.setThumbnail(queue.currentTrack?.thumbnail ?? null)
		.setDescription(
			`[${queue?.currentTrack?.title}](${queue?.currentTrack?.url})`
		)
		.setFooter({ text: `There are ${queue.getSize()} songs in the queue` });

	if (!queue.isEmpty()) {
		embedMsg.addFields(
			queue.tracks.map((track, key) => ({
				name: `${key + 1}. ${track.title}`,
				value: '\u200B',
				inline: true
			}))
		);
	}

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

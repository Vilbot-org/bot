import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import Command from '@/classes/Command';
import { previous } from '@/utils/musicUtils';
import { getVoiceChannel } from '@/utils/guildUtils';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);

	const queue = await previous(voiceChannel);

	const currentTrack = queue.currentTrack;
	const nextTrack = queue.tracks.at(0);

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setAuthor({ name: 'Going back to the previous song' })
				.setThumbnail(currentTrack?.thumbnail ?? null)
				.setTitle(`:track_previous: ${currentTrack?.title}`)
				.setURL(`${currentTrack?.url}`)
				.setDescription(
					queue.getSize() > 1
						? `The next song is:  [${nextTrack?.title}](${nextTrack?.url})`
						: 'There are no more songs in the queue!'
				)
		]
	});
};

const previousCommandOptions = {
	name: 'previous',
	description: 'Go back to the previous song!',
	execute: execute
};
const previousCommand = new Command(previousCommandOptions);

export default previousCommand;

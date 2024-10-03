import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import Command from '@/classes/Command';
import { previous } from '@/utils/musicUtils';
import { getVoiceChannel } from '@/utils/guildUtils';
import { getEmoji } from '@/common/utils/EmojiHelper';
import { formatTrackTitleForEmbed } from '@/utils/interactions';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);

	const queue = await previous(voiceChannel);

	const currentTrack = queue.currentTrack;

	const embedDescription = `${getEmoji('previous')} ${formatTrackTitleForEmbed(
		currentTrack
	)}`;
	const embedFooter =
		queue.getSize() >= 1
			? `${queue.getSize()} tracks in the queue`
			: 'No more trakcs in the queue';

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.displayAvatarURL()
				})
				.setThumbnail(currentTrack?.thumbnail ?? null)
				.setDescription(
					`**Previous track**
          ${embedDescription}`
				)
				.setFooter({
					text: embedFooter
				})
		]
	});
};

const previousCommandOptions = {
	name: 'previous',
	description: 'Go back to the previous track!',
	execute: execute
};
const previousCommand = new Command(previousCommandOptions);

export default previousCommand;

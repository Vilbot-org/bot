import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import Command from '@/classes/Command';
import { getVoiceChannel } from '@/utils/guildUtils';
import { skip } from '@/utils/musicUtils';
import { getEmoji } from '@/common/utils/EmojiHelper';
import { formatTrackTitleForEmbed } from '@/utils/interactions';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);

	const queue = skip(voiceChannel);

	const { tracks } = queue;
	const firstTrack = tracks.at(0);

	const embedDescription = queue.isEmpty()
		? ':wave: No more songs in the queue, Bye bye!'
		: `${getEmoji('next')} ${formatTrackTitleForEmbed(firstTrack)}`;

	const embedFooter =
		!queue.isEmpty() && queue.getSize() > 1
			? `${queue.getSize() - 1} songs in the queue`
			: 'No more songs in the queue';

	const embedMessage = new EmbedBuilder()
		.setColor(config.colors.success)
		.setAuthor({
			name: interaction.user.username,
			iconURL: interaction.user.displayAvatarURL()
		})
		.setDescription(
			`
      **Skipping track**
      ${embedDescription}
      `
		)
		.setFooter({
			text: embedFooter
		});

	if (!queue.isEmpty()) {
		embedMessage.setThumbnail(tracks?.at(0)?.thumbnail ?? null);
	}

	await interaction.reply({
		embeds: [embedMessage]
	});
};

const skipCommandOptions = {
	name: 'skip',
	description: 'Skip the current song!',
	execute: execute
};
const skipCommand = new Command(skipCommandOptions);

export default skipCommand;

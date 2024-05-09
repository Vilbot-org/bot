import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';
import Command from '@/classes/Command';
import { getVoiceChannel } from '@/utils/guildUtils';
import { skip } from '@/utils/musicUtils';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);

	const queue = skip(voiceChannel);
	const { tracks } = queue;

	const title = queue.isEmpty()
		? ':wave: Bye bye!'
		: `:track_next: ${tracks?.at(0)?.title}`;

	const description =
		!queue.isEmpty() && queue.getSize() > 1
			? `The next song is: [${tracks?.at(1)?.title}](${tracks?.at(1)?.url})`
			: 'No more songs in the queue';

	const embedMessage = new EmbedBuilder()
		.setColor(config.colors.success)
		.setTitle(title)
		.setDescription(description);

	if (!queue.isEmpty()) {
		embedMessage
			.setAuthor({ name: 'Forcing the skip of the song' })
			.setThumbnail(tracks?.at(0)?.thumbnail ?? null);
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

import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { author } from '../../../../package.json';

import config from '@/app.config';

const musicHelpSubCommand = async (
	interaction: ChatInputCommandInteraction
) => {
	const botName = interaction.client.user.username;

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.info)
				.setThumbnail(interaction.client.user.avatarURL())
				.setDescription(
					`
          **${botName} music help**
          Music commands list`
				)
				.addFields(
					{
						name: 'Play music',
						value:
							'Play your favorite music from YouTube or Spotify on the voice channel.\n`/play <song name or url>`'
					},
					{
						name: 'Display the info of the currently playin song.',
						value: '`/info`'
					},
					{
						name: 'Pause the music.',
						value: '`/pause`'
					},
					{
						name: 'Previous song in the queue.',
						value: '`/previous`'
					},
					{
						name: 'Skip the current song.',
						value: '`/skip`'
					},
					{
						name: 'Display queue of the bot.',
						value: '`/queue`'
					},
					{
						name: 'Resume the music.',
						value: '`/resume`'
					},
					{
						name: 'Pause the music.',
						value: '`/pause`'
					},
					{
						name: 'Play your favorite playlist in the voice channel.',
						value: '`/play-playlist <playlist-name>`'
					}
				)
				.setFooter({
					text: `${botName} by ${author}`
				})
		]
	});
};

export default musicHelpSubCommand;

import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import config from '@/app.config';

const musicHelpSubCommand = async (
	interaction: ChatInputCommandInteraction
) => {
	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.info)
				.setTitle(`${config.botName} music help`)
				.setDescription('Music commands list')
				.addFields(
					{
						name: 'Play your favorite songs in the voice channel.',
						value: '`/play <song name or url>`'
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
						name: 'Init the votation to skip the currently playing song.',
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
					text: 'Vilbot by GFrancV'
				})
				.setThumbnail(interaction.client.user.avatarURL())
		]
	});
};

export default musicHelpSubCommand;

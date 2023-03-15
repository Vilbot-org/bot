import { EmbedBuilder } from 'discord.js';

import config from '../../../app.config';

export default async (interaction) => {
	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.info)
				.setTitle(`${config.botName} music help`)
				.setDescription('Main command list:')
				.addFields(
					{
						name: 'Play your favorite songs in the voice channel.',
						value: '`/music play <song name or url>`'
					},
					{
						name: 'Play your favorite playlist in the voice channel.',
						value: '`/music playlist <playlist-name>`'
					},
					{
						name: 'Display the info of the currently playin song.',
						value: '`/music info`'
					},
					{
						name: 'Display queue of the bot.',
						value: '`/music queue`'
					},
					{
						name: 'Init the votation to skip the currently playing song.',
						value: '`/music skip`'
					},
					{
						name: 'All the commands',
						value: `To view the full list of music commands type \`/music\` or visit the [oficial site](${config.siteURL}).`
					}
				)
				.setFooter({
					text: config.botName
				})
				.setThumbnail(interaction.client.user.avatarURL())
		]
	});
};

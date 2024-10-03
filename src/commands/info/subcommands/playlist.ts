import { ChatInputCommandInteraction } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { author } from '../../../../package.json';

import appConfig from '@/app.config';

const playlistHelpSubCommand = async (
	interaction: ChatInputCommandInteraction
) => {
	const botName = interaction.client.user.username;

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(appConfig.colors.info)
				.setThumbnail(interaction.client.user.avatarURL())
				.setDescription(
					`
          **${botName} playlist help**
          With this command you can create playlists with your favortie songs!
          **Note:** The params with [playlist-name] are optional, if no name is provided the bot will use the default name ([username]-playlist, ex: vilbot-playlist).`
				)
				.addFields(
					{
						name: 'Create playlist',
						value:
							'Create your playlist with `/playlist create [playlist-name]`\n'
					},
					{
						name: 'Show playlist lists',
						value:
							'You can see the name of all of your playlists with: `/playlist list`'
					},
					{
						name: 'Show the songs',
						value:
							'To show all the songs in a playlist with: `/playlist show [playlist-name].`'
					},
					{
						name: 'Add songs',
						value:
							'Add songs from your playlist with: `/playlist add <song> [playlist-name]`.\n**Note**: The song has be a Spotify URL.'
					},
					{
						name: 'Remove songs',
						value:
							'Remove songs from your playlist with: `/playlist remove <song-ID> [playlist-name]`.\nTo see the song ID you can use playlist show.'
					},
					{
						name: 'Delete playlist',
						value: 'Delete a playlist with `/playlist delete [playlist-name]`'
					}
				)
				.setFooter({
					text: `${botName} by ${author}`
				})
		]
	});
};

export default playlistHelpSubCommand;

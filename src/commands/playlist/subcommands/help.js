import { EmbedBuilder } from 'discord.js';

import config from '../../../app.config';

export default async (client, interaction) => {
	return interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.info)
				.setAuthor({ name: 'Vilbot help command' })
				.setTitle('Playlist help')
				.setThumbnail(client.user.avatarURL())
				.setDescription(
					`With this command you can create awesome playlists with your favortie songs!\nFor more detailed information [visit the website](${config.siteURL}). `
				)
				.addFields(
					{
						name: 'Create playlist',
						value:
							'Create your playlist with `/playlist create [playlist-name]`.'
					},
					{
						name: 'Add songs',
						value:
							'Add songs from your playlist with: `/playlist add <song> [playlist-name]`.\n**Note**: The song has be a YouTube URL.'
					},
					{
						name: 'Remove songs',
						value:
							'Remove songs from your playlist with: `/playlist remove <song-ID> [playlist-name]`.\nTo see the song ID you can use the following command.'
					},
					{
						name: 'Show the songs in a playlist',
						value:
							'To show all the songs in a playlist with: `/playlist show [playlist-name].`'
					},
					{
						name: 'To list all the playlist you have',
						value:
							'You can see the name of all of your playlists with: `/playlist list`'
					}
				)
				.setFooter({
					text: 'In all the commands the playlist-name are optional, if no name is provided the bot will use the default name ([username]-playlist, ex: vilbot-playlist).'
				})
		]
	});
};

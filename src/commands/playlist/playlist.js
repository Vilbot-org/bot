import Command from '../../structures/Command';

import snipe from '../../schemas/UsersPlaylistsSchema';

export default class extends Command {
	constructor(client) {
		super(client, {
			name: 'playlist',
			description: 'Command to manage your playlists.',
			type: 2,
			options: [
				{
					name: 'create',
					description: 'Create a new playlist.',
					type: 1,
					options: [
						{
							name: 'name',
							description: 'The new of your new platlist.',
							type: 3,
							required: false
						}
					]
				},
				{
					name: 'delete',
					description: 'Delete a specific playlist.',
					type: 1,
					options: [
						{
							name: 'name',
							description: 'The name of the playlist you want to delete.',
							type: 3,
							required: true
						}
					]
				},
				{
					name: 'list',
					description: 'List your saved playlists.',
					type: 1
				},
				{
					name: 'show',
					description: 'Display the songs in a playlist.',
					type: 1,
					options: [
						{
							name: 'name',
							description: 'The name of the playlist to show.',
							type: 3,
							required: false
						}
					]
				},
				{
					name: 'add',
					description: 'Add a new song in your playlist.',
					type: 1,
					options: [
						{
							name: 'song',
							description: 'The URL of the song to add.',
							type: 3,
							required: true
						},
						{
							name: 'playlist',
							description: 'The playlist you want to add this song.',
							type: 3,
							required: false
						}
					]
				},
				{
					name: 'remove',
					description: 'Remove a song in your playlist.',
					type: 1,
					options: [
						{
							name: 'song',
							description: 'The position of the song in your playlist.',
							type: 3,
							required: true
						},
						{
							name: 'playlist',
							description: 'The playlist you want to remove this song.',
							type: 3,
							required: false
						}
					]
				},
				{
					name: 'help',
					description: 'Display help about this command.',
					type: 1
				}
			]
		});
	}

	run = async (interaction) => {
		const subCommand = interaction.options.getSubcommand();

		const { default: subCommandFunction } = await import(
			`./subcommands/${subCommand}`
		);
		await subCommandFunction(this.client, interaction, snipe);
	};
}

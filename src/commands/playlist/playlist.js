import Command from '../../structures/Command';

import errorHandler from '../../handlers/errorHandler';

export default class extends Command {
	constructor(client) {
		super(client, {
			name: 'playlist',
			description: 'Command to manage your playlists.',
			options: [
				{
					type: 1,
					name: 'create',
					description: 'Create a new playlist.',
					options: [
						{
							type: 3,
							name: 'name',
							description: 'The new of your new platlist.',
							required: false
						}
					]
				},
				{
					type: 1,
					name: 'delete',
					description: 'Delete a specific playlist.',
					options: [
						{
							type: 3,
							name: 'name',
							description: 'The name of the playlist you want to delete.',
							required: true
						}
					]
				},
				{
					type: 1,
					name: 'list',
					description: 'List your saved playlists.'
				},
				{
					type: 1,
					name: 'show',
					description: 'Display the songs in a playlist.',
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
					type: 1,
					name: 'add',
					description: 'Add a new song in your playlist.',
					options: [
						{
							type: 3,
							name: 'song',
							description: 'The name or URL of the song to add.',
							required: true
						},
						{
							type: 3,
							name: 'playlist',
							description: 'The playlist you want to add this song.',
							required: false
						}
					]
				},
				{
					type: 1,
					name: 'remove',
					description: 'Remove a song in your playlist.',
					options: [
						{
							type: 3,
							name: 'song',
							description: 'The id of the song in your playlist.',
							required: true
						},
						{
							type: 3,
							name: 'playlist',
							description: 'The playlist you want to remove this song.',
							required: false
						}
					]
				},
				{
					type: 1,
					name: 'help',
					description: 'Display help about this command.'
				}
			]
		});
	}

	run = async (interaction) => {
		const subCommand = interaction.options.getSubcommand();

		try {
			const { default: subCommandFunction } = await import(
				`./subcommands/${subCommand}`
			);
			await subCommandFunction(this.client, interaction);
		} catch (e) {
			errorHandler(interaction, e);
		}
	};
}

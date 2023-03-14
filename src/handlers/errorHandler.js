import { EmbedBuilder } from 'discord.js';

import DeferError from '../errors/DeferErrors';

import config from '../app.config';

const errorConfig = {
	'in-voice-channel': {
		title: 'You need to be in a voice channel!',
		description: 'Enter to any voice channel and try again.'
	},

	'no-permission': {
		title: "You don't have permission to do that!",
		description:
			'Only moderators and administrators are allowed to use this command.'
	},

	'no-songs-queue': {
		title: 'Music queue!',
		description: 'No songs in the queue, use `/music play <song>` do add songs!'
	},

	'music-already-paused': {
		title: 'The music is already paused!',
		description: 'Use `/music resume` to resume a song.'
	},

	'music-resumed': {
		title: 'The music in not paused!',
		description: 'Use `/music pause` to pause a song.'
	},

	'playlist-dont-exist': {
		title: "This playlist don't exist!",
		description: 'Use `/playlist create <playlist>` to create a playlist.'
	},

	'playlist-no-songs': {
		title: "This playlist don't have songs!",
		description:
			'You can add songs to this playlist with the following command: `/playlist add <song> <playlist>`.'
	},

	'channel-already-exist': {
		title: 'The channel already exists!',
		description: `If you want to reset the bot channel please delete the '${config.botName}-music' text channel and run this command again.`
	},

	'creating-channel': {
		title: 'An error occurred while creating the channel!',
		description: `Check the permissions and try again.`
	},

	'already-vote': {
		title: 'You have already voted!',
		description: 'Wait for the vote to be resolved.'
	},

	'search-song-not-found': {
		title: 'Song not found!',
		description: 'Try another specific name or Youtube URL.'
	},

	'no-playlist-exist': {
		title: 'No playlist with that name found!',
		description:
			'Create the playlist first with `/playlist create <playlist>` command and then add your songs!'
	},

	'playlist-already-exist': {
		title:
			'A playlist with that name already exists or you already have your default playlist created!',
		description: 'Create a new playlist or add songs to the exist playlist!'
	},

	'no-playlist-to-delete': {
		title: "You don't have any playlist with this name!",
		description:
			'Please check the name with the command `/playlist list` and try again'
	},

	'dont-have-playlist': {
		title: "Oops! You still don't have playlists!",
		description:
			'Type`/playlist create <playlist-name>` to create a new playlist.'
	},

	'invalid-song-id': {
		title: 'Invalid song to remove!',
		description: 'Please enter a valit number song.'
	},

	'song-no-found-playlist': {
		title: 'The song you have indicated does not exist in the playlist!',
		description: 'Please check the song and try again.'
	},

	default: {
		title: 'Oops! Unexpected error',
		description: 'Wait a few seconds and try again.'
	}
};

export default async (interaction, error) => {
	const { title, description } =
		errorConfig[error.message] || errorConfig.default;

	if (error instanceof DeferError) {
		await interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.danger)
					.setTitle(`:x: ${title}`)
					.setDescription(description)
			],
			ephemeral: true
		});
	} else {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.danger)
					.setTitle(`:x: ${title}`)
					.setDescription(description)
			],
			ephemeral: true
		});
	}
};

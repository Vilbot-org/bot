import Guild from '@/models/Guild';
import { useQueue } from 'discord-player';
import formatSong from '../formatSong';
import { fskip, pause, play, resume } from '../musicUtils';
import socket from './socketClient';
import socketError from './socketFunctions';

socket.on('bot.getQueue', async (guild) => {
	try {
		const fetchedQueue = await useQueue(guild);

		if (!fetchedQueue) {
			socket.emit('bot.queue', { guild, queue: null });
			return;
		}

		const data = {
			guild,
			queue: {
				currentSong: {
					...formatSong(fetchedQueue.currentTrack),
					playbackTime: fetchedQueue.node.playbackTime
				},
				songs: fetchedQueue?.tracks.map((track) => formatSong(track))
			}
		};

		socket.emit('bot.queue', data);
	} catch (error) {
		socketError(error);
	}
});

socket.on('bot.playSong', async ({ query, guild: guildId, user }) => {
	try {
		const guild = await Guild.findById(guildId);

		const channelds = Object.keys(guild.activeVoiceUsers);

		const findChannel = channelds.find((channel) => {
			const users = guild.activeVoiceUsers[channel];
			return users.includes(user);
		});

		if (findChannel) {
			await play(query, guildId, findChannel);
		} else {
			//Add error
			console.log('Error');
		}
	} catch (error) {
		console.log(error);
		socketError(error);
	}
});

socket.on('bot.nextSong', async (guild) => {
	try {
		await fskip(guild);
	} catch (error) {
		socketError(error);
	}
});

socket.on('bot.pauseSong', async (guild) => {
	try {
		await pause(guild);
	} catch (error) {
		socketError(error);
	}
});

socket.on('bot.resumeSong', async (guild) => {
	try {
		await resume(guild);
	} catch (error) {
		socketError(error);
	}
});

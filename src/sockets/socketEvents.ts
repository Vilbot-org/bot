import { useQueue } from 'discord-player';

import socketError from './socketFunctions';
import type BotClient from '@/classes/BotClient';
import { SocketEvents } from '@/enums/Sockets';
import { formatQueue } from '@/utils/formatMessages';
import { getVoiceChannelById } from '@/utils/guildUtils';
import logger from '@/utils/logger';
import {
	pause,
	play,
	playPlaylist,
	previous,
	removeTrack,
	resume,
	skip
} from '@/utils/musicUtils';
import {
	GuildPayload,
	ServerPlayTrackPayload,
	TrackIndexPayload,
	VoiceChannelPayload
} from '@/types/ISocket';

const registerSocketEvents = (client: BotClient) => {
	const onConnect = () => {
		logger.info('Success connection to socket server');
	};

	const requestQueue = async ({ guildId }: GuildPayload) => {
		try {
			const fetchedQueue = useQueue(guildId);

			if (!fetchedQueue) {
				client.socket.emit(SocketEvents.BotRequestedQueue, {
					queue: null,
					guildId
				});
				return;
			}

			client.socket.emit(SocketEvents.BotRequestedQueue, {
				queue: formatQueue(fetchedQueue),
				guildId
			});
		} catch (error) {
			socketError(client, error as Error);
		}
	};

	const requestPlayTrack = async ({
		trackUrl,
		voiceChannelId,
		user
	}: ServerPlayTrackPayload) => {
		try {
			const voiceChannel = await getVoiceChannelById(client, voiceChannelId);
			await play(trackUrl, voiceChannel, user);
		} catch (error) {
			socketError(client, error as Error);
		}
	};

	const requestPreviousTrack = async ({
		voiceChannelId
	}: VoiceChannelPayload) => {
		try {
			const voiceChannel = await getVoiceChannelById(client, voiceChannelId);
			previous(voiceChannel);
		} catch (error) {
			socketError(client, error as Error);
		}
	};

	const requestSkipTrack = async ({ voiceChannelId }: VoiceChannelPayload) => {
		try {
			const voiceChannel = await getVoiceChannelById(client, voiceChannelId);
			skip(voiceChannel);
		} catch (error) {
			socketError(client, error as Error);
		}
	};

	const requestRemoveTrack = async ({
		trackIndex,
		voiceChannelId
	}: TrackIndexPayload) => {
		try {
			const voiceChannel = await getVoiceChannelById(client, voiceChannelId);
			removeTrack(trackIndex, voiceChannel);
		} catch (error) {
			socketError(client, error as Error);
		}
	};

	const requestPlayPlaylist = async ({
		tracks,
		voiceChannelId,
		user
	}: ServerPlayTrackPayload & { tracks: string[] }) => {
		try {
			const voiceChannel = await getVoiceChannelById(client, voiceChannelId);
			await playPlaylist(tracks, voiceChannel, user);
		} catch (error) {
			socketError(client, error as Error);
		}
	};

	const requestResumeMusicPlayer = async ({
		voiceChannelId
	}: VoiceChannelPayload) => {
		try {
			const voiceChannel = await getVoiceChannelById(client, voiceChannelId);
			resume(voiceChannel);
		} catch (error) {
			socketError(client, error as Error);
		}
	};

	const requestPauseMusicPlayer = async ({
		voiceChannelId
	}: VoiceChannelPayload) => {
		try {
			const voiceChannel = await getVoiceChannelById(client, voiceChannelId);
			pause(voiceChannel);
		} catch (error) {
			socketError(client, error as Error);
		}
	};

	client.socket.on('connect', onConnect);
	client.socket.on(SocketEvents.ServerRequestQueue, requestQueue);
	client.socket.on(SocketEvents.ServerRequestPlayTrack, requestPlayTrack);
	client.socket.on(
		SocketEvents.ServerRequestPreviousTrack,
		requestPreviousTrack
	);
	client.socket.on(SocketEvents.ServerRequestSkipTrack, requestSkipTrack);
	client.socket.on(SocketEvents.ServerRequestRemoveTrack, requestRemoveTrack);
	client.socket.on(SocketEvents.ServerRequestPlayPlaylist, requestPlayPlaylist);
	client.socket.on(
		SocketEvents.ServerRequestResumeMusicPlayer,
		requestResumeMusicPlayer
	);
	client.socket.on(
		SocketEvents.ServerRequestPauseMusicPlayer,
		requestPauseMusicPlayer
	);
};

export default registerSocketEvents;

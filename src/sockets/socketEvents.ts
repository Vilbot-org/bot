import { useQueue } from 'discord-player';

import socketError from './socketFunctions';
import type BotClient from '@/classes/BotClient';
import { SocketEvents } from '@/enums/Sockets';
import { formatQueue } from '@/utils/formatMessages';
import { getVoiceChannelById } from '@/utils/guildUtils';
import Logger from '@/common/services/Logger';
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
		Logger.info(
			'socketEvents',
			'onConnect',
			'Success connection to socket server'
		);
	};

	const requestQueue = async ({ guildId }: GuildPayload) => {
		try {
			const fetchedQueue = useQueue(guildId);

			Logger.info(
				'socketEvents',
				'requestQueue',
				`Requested queue for guild ${guildId}`,
				guildId
			);
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
			await play(trackUrl, voiceChannel, user.id);

			Logger.info(
				'socketEvents',
				'requestPlayTrack',
				`Requested play track for guild ${voiceChannelId}`,
				voiceChannelId
			);
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

			Logger.info(
				'socketEvents',
				'requestPreviousTrack',
				`Requested previous track for guild ${voiceChannelId}`,
				voiceChannelId
			);
		} catch (error) {
			socketError(client, error as Error);
		}
	};

	const requestSkipTrack = async ({ voiceChannelId }: VoiceChannelPayload) => {
		try {
			const voiceChannel = await getVoiceChannelById(client, voiceChannelId);
			skip(voiceChannel);

			Logger.info(
				'socketEvents',
				'requestSkipTrack',
				`Requested skip track for guild ${voiceChannelId}`,
				voiceChannelId
			);
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

			Logger.info(
				'socketEvents',
				'requestRemoveTrack',
				`Requested remove track for guild ${voiceChannelId}`,
				voiceChannelId
			);
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
			await playPlaylist(tracks, voiceChannel, user.id);

			Logger.info(
				'socketEvents',
				'requestPlayPlaylist',
				`Requested play playlist for guild ${voiceChannelId}`,
				voiceChannelId
			);
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

			Logger.info(
				'socketEvents',
				'requestResumeMusicPlayer',
				`Requested resume music player for guild ${voiceChannelId}`,
				voiceChannelId
			);
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

			Logger.info(
				'socketEvents',
				'requestPauseMusicPlayer',
				`Requested pause music player for guild ${voiceChannelId}`,
				voiceChannelId
			);
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

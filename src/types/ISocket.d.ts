import type { User } from 'discord.js';
import type { IBotQueue, IBotTrack } from './IBot';

interface VoiceChannelPayload {
	voiceChannelId: string;
}

interface ServerPlayTrackPayload extends VoiceChannelPayload {
	trackUrl: string;
	user: User;
}

interface GuildPayload {
	guildId: string;
}

interface TrackIndexPayload extends VoiceChannelPayload {
	trackIndex: number;
}

interface BotTrackPayload extends GuildPayload {
	track: IBotTrack | null;
}

interface BotQueuePayload extends GuildPayload {
	queue: IBotQueue | null;
}

export interface IServerToBotEvents {
	'server.requestQueue': (payload: GuildPayload) => void;
	'server.requestPlayTrack': (payload: ServerPlayTrackPayload) => void;
	'server.requestPreviousTrack': (payload: VoiceChannelPayload) => void;
	'server.requestSkipTrack': (payload: VoiceChannelPayload) => void;
	'server.requestRemoveTrack': (payload: TrackIndexPayload) => void;
	'server.requestPlayPlaylist': (
		payload: ServerPlayTrackPayload & { tracks: string[] }
	) => void;
	'server.requestResumeMusicPlayer': (payload: VoiceChannelPayload) => void;
	'server.requestPauseMusicPlayer': (payload: VoiceChannelPayload) => void;
}

export interface IBotToServerEvents {
	'bot.requestedQueue': (payload: BotQueuePayload) => void;
	'bot.playedTrack': (payload: BotTrackPayload) => void;
	'bot.skipedTrack': (payload: GuildPayload) => void;
	'bot.removedTrack': (payload: BotTrackIndexPayload) => void;
	'bot.resumedMusicPlayer': (payload: GuildPayload) => void;
	'bot.pausedMusicPlayer': (payload: GuildPayload) => void;
	'bot.deletedQueue': (payload: GuildPayload) => void;
	'bot.startedPlaying': (payload: BotQueuePayload) => void;
	'bot.emptyQueue': (payload: GuildPayload) => void;
	'bot.connectionDestroyed': (payload: GuildPayload) => void;
	'bot.error': (error: object) => void;
}

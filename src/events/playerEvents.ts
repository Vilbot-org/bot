import appConfig from '@/app.config';
import type BotClient from '@/classes/BotClient';
import { SocketEvents } from '@/enums/Sockets';
import type { GuildMusicQueueAndVoiceInfo } from '@/types/IMusic';
import { formatQueue, formatTrack } from '@/utils/formatMessages';
import logger from '@/utils/logger';
import { EmbedBuilder } from '@discordjs/builders';
import type { GuildQueue, Track } from 'discord-player';
import { GuildQueueEvent } from 'discord-player';

const registerPlayerEvents = (client: BotClient) => {
	const playerStartEvent = (
		queue: GuildMusicQueueAndVoiceInfo,
		track: Track
	) => {
		queue.metadata.channel.send({
			embeds: [
				new EmbedBuilder()
					.setColor(appConfig.colors.info)
					.setAuthor({ name: 'Started playing' })
					.setTitle(`${track.title}`)
					.setURL(`${track.url}`)
					.setThumbnail(`${track.thumbnail}`)
					.setFooter({
						text:
							queue.getSize() >= 1
								? `Next song in the queue: ${queue.tracks.at(0)?.title}`
								: 'No more songs queued'
					})
			]
		});

		client.socket.emit(
			SocketEvents.BotStartedPlaying,
			formatQueue(queue),
			queue.guild.id
		);
	};

	const audioTrackAddEvent = (queue: GuildQueue, track: Track) => {
		client.socket.emit(
			SocketEvents.BotPlayedTrack,
			formatTrack(track),
			queue.guild.id
		);
	};

	const playerSkipEvent = (queue: GuildQueue) => {
		client.socket.emit(SocketEvents.BotSkipedTrack, queue.guild.id);
	};

	const playerResumeEvent = (queue: GuildQueue) => {
		client.socket.emit(SocketEvents.BotResumedMusicPlayer, queue.guild.id);
	};

	const playerPauseEvent = (queue: GuildQueue) => {
		client.socket.emit(SocketEvents.BotPausedMusicPlayer, queue.guild.id);
	};

	const queueDeleteEvent = (queue: GuildQueue) => {
		client.socket.emit(SocketEvents.BotDeletedQueue, queue.guild.id);
	};

	const emptyQueueEvent = (queue: GuildQueue) => {
		client.socket.emit(SocketEvents.BotEmptyQueue, queue.guild.id);
	};

	const connectionDestroyedEvent = (queue: GuildQueue) => {
		client.socket.emit(SocketEvents.BotConnectionDestroyed, queue.guild.id);
	};
	const errorEvent = (_queue: GuildQueue, error: Error) => {
		logger.error(`General player error event: ${error.message}`);
	};

	const playerErrorEvent = (_queue: GuildQueue, error: Error) => {
		logger.error(`Player error event: ${error.message}`);
	};

	client.player.events.on(GuildQueueEvent.playerStart, playerStartEvent);
	client.player.events.on(GuildQueueEvent.audioTrackAdd, audioTrackAddEvent);
	client.player.events.on(GuildQueueEvent.playerSkip, playerSkipEvent);
	client.player.events.on(GuildQueueEvent.playerResume, playerResumeEvent);
	client.player.events.on(GuildQueueEvent.playerPause, playerPauseEvent);
	client.player.events.on(GuildQueueEvent.queueDelete, queueDeleteEvent);
	client.player.events.on(GuildQueueEvent.emptyQueue, emptyQueueEvent);
	client.player.events.on(
		GuildQueueEvent.connectionDestroyed,
		connectionDestroyedEvent
	);
	client.player.events.on(GuildQueueEvent.error, errorEvent);
	client.player.events.on(GuildQueueEvent.playerError, playerErrorEvent);
};

export default registerPlayerEvents;

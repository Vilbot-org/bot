import appConfig from '@/app.config';
import type BotClient from '@/classes/BotClient';
import { getEmoji } from '@/common/utils/EmojiHelper';
import { SocketEvents } from '@/enums/Sockets';
import type { GuildMusicQueueAndVoiceInfo } from '@/types/IMusic';
import { formatQueue, formatTrack } from '@/utils/formatMessages';
import { formatTrackTitleForEmbed } from '@/utils/interactions';
import Logger from '@/common/services/Logger';
import { EmbedBuilder } from '@discordjs/builders';
import type { GuildQueue, Track } from 'discord-player';
import { GuildQueueEvent } from 'discord-player';

const registerPlayerEvents = (client: BotClient) => {
	const playerStartEvent = (
		queue: GuildMusicQueueAndVoiceInfo,
		track: Track
	) => {
		Logger.info(
			'playerEvents',
			'playerStart',
			`Started playing ${track.title}`,
			queue.guild.id
		);

		const embedFooter =
			queue.getSize() >= 1
				? `Queue position: ${queue.getSize()}`
				: 'No more songs queued';

		queue.metadata.channel.send({
			embeds: [
				new EmbedBuilder()
					.setColor(appConfig.colors.info)
					.setAuthor({
						name: track.requestedBy?.username ?? 'Unknown',
						iconURL: track?.requestedBy?.displayAvatarURL()
					})
					.setThumbnail(`${track.thumbnail}`)
					.setDescription(
						`
            **Playing**
            ${getEmoji('playing')} ${formatTrackTitleForEmbed(track)}`
					)
					.setFooter({
						text: embedFooter
					})
			]
		});

		client.socket.emit(SocketEvents.BotStartedPlaying, {
			queue: formatQueue(queue),
			guildId: queue.guild.id
		});
	};

	const audioTrackAddEvent = (queue: GuildQueue, track: Track) => {
		Logger.info(
			'playerEvents',
			'audioTrackAdd',
			`${track.title} added to the queue`,
			queue.guild.id
		);

		client.socket.emit(SocketEvents.BotPlayedTrack, {
			track: formatTrack(track),
			guildId: queue.guild.id
		});
	};

	const playerSkipEvent = (queue: GuildQueue) => {
		Logger.info('playerEvents', 'playerSkip', 'Skipped track', queue.guild.id);

		client.socket.emit(SocketEvents.BotSkipedTrack, {
			guildId: queue.guild.id
		});
	};

	const playerResumeEvent = (queue: GuildQueue) => {
		Logger.info(
			'playerEvents',
			'playerResume',
			'Resumed music player',
			queue.guild.id
		);

		client.socket.emit(SocketEvents.BotResumedMusicPlayer, {
			guildId: queue.guild.id
		});
	};

	const playerPauseEvent = (queue: GuildQueue) => {
		Logger.info(
			'playerEvents',
			'playerPause',
			'Paused music player',
			queue.guild.id
		);

		client.socket.emit(SocketEvents.BotPausedMusicPlayer, {
			guildId: queue.guild.id
		});
	};

	const queueDeleteEvent = (queue: GuildQueue) => {
		Logger.info('playerEvents', 'queueDelete', 'Deleted queue', queue.guild.id);

		client.socket.emit(SocketEvents.BotDeletedQueue, {
			guildId: queue.guild.id
		});
	};

	const emptyQueueEvent = (queue: GuildQueue) => {
		Logger.info('playerEvents', 'emptyQueue', 'Empty queue', queue.guild.id);

		client.socket.emit(SocketEvents.BotEmptyQueue, {
			guildId: queue.guild.id
		});
	};

	const connectionDestroyedEvent = (queue: GuildQueue) => {
		Logger.info(
			'playerEvents',
			'connectionDestroyed',
			'Connection destroyed',
			queue.guild.id
		);

		client.socket.emit(SocketEvents.BotConnectionDestroyed, {
			guildId: queue.guild.id
		});
	};
	const errorEvent = (queue: GuildQueue, error: Error) => {
		Logger.error(
			'playerEvents',
			'error',
			`General player error event: ${error.message}`,
			queue.guild.id
		);
	};

	const playerErrorEvent = (queue: GuildQueue, error: Error) => {
		Logger.error(
			'playerEvents',
			'playerError',
			`Player error event: ${error.message}`,
			queue.guild.id
		);
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

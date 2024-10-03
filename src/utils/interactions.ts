import type { GuildQueue, Track } from 'discord-player';

export const formatTrackTitleForEmbed = (
	track: Track | undefined | null
): string => {
	if (!track) {
		return ':warning: Unable to retrieve the track.';
	}

	return `**[${track.title}](${track.url})** **\`${track.duration}\`**`;
};

export const formatDurationQueueForEmbed = (queue: GuildQueue): string => {
	let queueDurationMs: number = queue.estimatedDuration;
	if (queue.currentTrack) {
		queueDurationMs += queue.currentTrack.durationMS;
	}

	const durationDate: Date = new Date(0);
	durationDate.setMilliseconds(queueDurationMs);

	const durationDays: number = durationDate.getUTCDate() - 1;
	const durationHours: number = durationDate.getUTCHours();
	const durationMinutes: number = durationDate.getUTCMinutes();
	const durationSeconds: number = durationDate.getUTCSeconds();

	if (durationDays >= 1) {
		return `${durationDays}d ${durationHours}h`;
	}
	if (durationHours >= 1) {
		return `${durationHours}h ${durationMinutes}m`;
	}
	if (durationMinutes >= 1) {
		return `${durationMinutes}m ${durationSeconds}s`;
	}
	return `${durationSeconds}s`;
};

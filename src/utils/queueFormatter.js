import formatUser from './userFormatter';

const formatTrack = (track) => ({
	id: track.id,
	title: track.title,
	author: track.author,
	thumbnail: track.thumbnail,
	duration: track.duration,
	durationMS: track.durationMS,
	requestedBy: formatUser(track.requestedBy)
});

const formatQueue = (fetchedQueue) => {
	const isPaused = fetchedQueue.node.isPaused();

	return {
		isPaused,
		currentSong: {
			...formatTrack(fetchedQueue.currentTrack),
			playbackTime: fetchedQueue.node.playbackTime
		},
		songs: fetchedQueue?.tracks.map((track) => formatTrack(track))
	};
};

export { formatQueue, formatTrack };

const formatUser = (user) => {
	return {
		username: user.username,
		avatar_url: user?.avatar_url ?? user?.avatarURL()
	};
};

const formatTrack = (track) => ({
	id: track.id,
	title: track.title,
	author: track.author,
	thumbnail: track.thumbnail,
	duration: track.duration,
	durationMS: track.durationMS,
	requestedBy: formatUser(track.requestedBy)
});

export { formatTrack, formatUser };

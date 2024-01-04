const formatSong = (song) => ({
	id: song.id,
	title: song.title,
	author: song.author,
	thumbnail: song.thumbnail,
	duration: song.duration,
	durationMS: song.durationMS
});

export default formatSong;

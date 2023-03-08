const { Player } = require("discord-player");

module.exports = client => {
	return Player.singleton(client, {
		ytdlOptions: {
			quality: "highestaudio",
			highWaterMark: 1 << 25,
		},
	});
};

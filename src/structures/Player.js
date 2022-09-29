const { Player } = require("discord-player");

module.exports = client => {
	return new Player(client, {
		ytdlOptions: {
			quality: "highestaudio",
			highWaterMark: 1 << 25,
		},
	});
};

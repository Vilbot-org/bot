import { Player } from 'discord-player';

export default (client) => {
	return Player.singleton(client, {
		ytdlOptions: {
			quality: 'highestaudio',
			highWaterMark: 1 < 25
		}
	});
};

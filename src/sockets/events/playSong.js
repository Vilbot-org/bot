import { useMasterPlayer as player } from 'discord-player';

import socket from '../socket';

socket.on('playSong', async (query) => {
	const searchResult = await player().search(query);

	const { track } = await player().play('1026501495006437386', searchResult, {
		nodeOptions: {
			volume: 40
		}
	});

	socket.emit('play', track.title);
});

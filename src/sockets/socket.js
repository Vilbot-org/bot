import io from 'socket.io-client';
import jwt from 'jsonwebtoken';
import { useMasterPlayer as player } from 'discord-player';

const token = jwt.sign({ user: 'Vilbot' }, 'thisisasecretkey');

const socket = io('http://localhost:3000/', {
	auth: {
		token
	}
});

socket.on('bot.playMusic', async (data) => {
	const searchResult = await player().search(data);

	const { track } = await player().play('1026501495513952349', searchResult, {
		nodeOptions: {
			volume: 40
		}
	});

	console.log(track.title);
});

export default socket;

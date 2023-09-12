import { useMasterPlayer as player } from 'discord-player';
import client from '../../Client';

player().events.on('playerStart', (queue, track) => {
	console.log(client.voice.adapters);
	client.channels.cache
		.get('1085567298888270044')
		.send(`Started playing: **${track.title}**`);
	/* queue.metadata.send(`Started playing: **${track.title}**`); */
});

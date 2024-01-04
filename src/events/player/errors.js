import { useMainPlayer as player } from 'discord-player';

player().events.on('error', (queue, error) => {
	// Emitted when the player queue encounters error
	console.log(`General player error event: ${error.message}`);
	console.log(error);
});

player().events.on('playerError', (queue, error) => {
	// Emitted when the audio player errors while streaming audio track
	console.log(`Player error event: ${error.message}`);
	console.log(error);
});

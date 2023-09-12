import { useMasterPlayer as player, useQueue } from 'discord-player';

import MusicErrors from '../errors/MusicErrors';

const play = async (query, guildChannel) => {
	const searchResult = await player().search(query);

	if (!searchResult.hasTracks())
		throw new MusicErrors(
			'No results found',
			'No results were found for that request, try another name or a youtube URL.'
		);

	const { queue, track } = await player().play(guildChannel, searchResult, {
		nodeOptions: {
			volume: 40,
			metadata: guildChannel
		}
	});

	return { queue, track };
};

const fskip = async (guildChannel) => {
	const queue = useQueue(guildChannel);

	if (!queue)
		throw new MusicErrors(
			'Music queue',
			'No songs in the queue, use `/music play <song>` do add songs.'
		);

	await queue.node.skip();

	return queue;
};

export { play, fskip };

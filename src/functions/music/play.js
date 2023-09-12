import { useMasterPlayer as player } from 'discord-player';

import MusicErrors from '../../errors/MusicErrors';

const play = async (query, guildChannel) => {
	const searchResult = await player().search(query);

	const { queue, track } = await player().play(guildChannel, searchResult, {
		nodeOptions: {
			volume: 40,
			metadata: guildChannel
		}
	});

	if (!searchResult.hasTracks())
		throw new MusicErrors(
			'No results found',
			'No results were found for that request, try another name or a youtube URL.'
		);

	return { queue, track };
};

export default play;

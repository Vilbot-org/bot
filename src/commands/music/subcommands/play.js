const { QueryType } = require("discord-player");
const embed = require("../../../structures/EmbedMessages");

module.exports = async (client, interaction) => {
	if (!interaction.member.voice.channel) return interaction.reply("You need to be in a voice channel!");

	const queue = await client.player.createQueue(interaction.guild);

	if (!queue.connection) await queue.connect(interaction.member.voice.channel);

	let query = interaction.options.getString("song");
	//Serch with the search term first
	let result = await client.player.search(query, {
		requestedBy: interaction.user,
		searchEngine: QueryType.AUTO,
	});
	//If the bot does not find songs by name, it proceeds to search by url
	if (result.tracks.length === 0) {
		result = await client.player.search(query, {
			requestedBy: interaction.user,
			searchEngine: QueryType.YOUTUBE_VIDEO,
		});
		if (result.tracks.length === 0) return interaction.reply("No results");
	}
	const song = result.tracks[0];
	await queue.addTrack(song);

	let positionQueue = queue.tracks.findIndex(track => {
		return track.id == result.tracks[0].id;
	});

	const embedMsg = {
		type: "rich",
		title: `${result.tracks[0].title}`,
		description: `Add to the queue`,
		color: 0x00ffff,
		fields: [
			{
				name: `Duration`,
				value: `${result.tracks[0].duration}`,
				inline: true,
			},
			{
				name: `Position in the queue`,
				value: `${positionQueue + 1}`,
				inline: true,
			},
		],
		thumbnail: {
			url: `${result.tracks[0].thumbnail}`,
		},
		footer: {
			text: `Next song in the queue: ${queue.tracks[0].title}`,
		},
		url: `${result.tracks[0].url}`,
	};

	if (!queue.playing) await queue.play();
	await interaction.reply({
		embeds: [embedMsg],
	});
};

const { QueryType } = require("discord-player");
const embed = require("../../../structures/EmbedMessages");

const { EmbedBuilder } = require("discord.js");

module.exports = async (client, interaction) => {
	if (!interaction.member.voice.channel) return interaction.reply("You need to be in a voice channel!");

	const queue = await client.player.createQueue(interaction.guild);

	if (!queue.connection) await queue.connect(interaction.member.voice.channel);

	let query = interaction.options.getString("track");
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

	/* 	const message = {
		title: `Add ${result.tracks[0].title} to the queue!`,
		description: `Duration: ${result.tracks[0].duration}`,
		image: `${result.tracks[0].thumbnail}`,
	};
	const embedMsg = embed(message, "success");
 */
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

	/* 	if (interaction.options.getSubcommand() === "song") {
		let url = interaction.options.getString("url");
		const result = await client.player.search(url, {
			requestedBy: interaction.user,
			searchEngine: QueryType.YOUTUBE_VIDEO,
		});
		if (result.tracks.length === 0) return interaction.editReply("No results");

		const song = result.tracks[0];
		await queue.addTrack(song);
		embed
			.setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
			.setThumbnail(song.thumbnail)
			.setFooter({ text: `Duration: ${song.duration}` });
	} else if (interaction.options.getSubcommand() === "playlist") {
		let url = interaction.options.getString("url");
		const result = await client.player.search(url, {
			requestedBy: interaction.user,
			searchEngine: QueryType.YOUTUBE_PLAYLIST,
		});

		if (result.tracks.length === 0) return interaction.editReply("No results");

		const playlist = result.playlist;
		await queue.addTracks(result.tracks);
		embed
			.setDescription(
				`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`
			)
			.setThumbnail(playlist.thumbnail);
	} else if (interaction.options.getSubcommand() === "search") {
		let url = interaction.options.getString("searchterms");
		const result = await client.player.search(url, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO,
		});

		if (result.tracks.length === 0) return interaction.editReply("No results");

		const song = result.tracks[0];
		await queue.addTrack(song);
		embed
			.setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
			.setThumbnail(song.thumbnail)
			.setFooter({ text: `Duration: ${song.duration}` });
	}
	if (!queue.playing) await queue.play();
	await interaction.editReply({
		embeds: [embed],
	}); */
};

const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const { colors } = require("../../../../config.json");

module.exports = async (client, interaction) => {
	const queue = await client.player.createQueue(interaction.guild);

	if (!queue.connection) await queue.connect(interaction.member.voice.channel);

	const playlistUrl = interaction.options.getString("playlist");
	const results = await client.player.search(playlistUrl, {
		requestedBy: interaction.user,
		searchEngine: QueryType.YOUTUBE_PLAYLIST,
	});

	if (results.tracks.length === 0)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.danger)
					.setTitle(":x: No songs found!")
					.setDescription("Verify if the provides URL are correctly or try with other playlist."),
			],
			ephimeral: true,
		});

	const playlist = results.playlist;
	await queue.addTracks(results.tracks);

	if (!queue.playing) await queue.play();

	let totalDuration = 0;
	for (const track of playlist.tracks) {
		totalDuration += parseFloat(track.duration);
	}

	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.success)
				.setAuthor({ name: "Add to the queue" })
				.setTitle(`The ${playlist.title} playlist`)
				.setURL(playlist.url)
				.setThumbnail(playlist.thumbnail.url)
				.setFields({ name: "Duration", value: `${totalDuration}min aprox`, inline: true })
				.setFooter({ text: `${results.tracks.length} songs add.` }),
		],
	});
};

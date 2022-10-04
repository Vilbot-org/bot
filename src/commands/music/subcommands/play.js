const { QueryType } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

const { colors } = require("../../../../config.json");

module.exports = async (client, interaction) => {
	const embedMsg = new EmbedBuilder();

	const queue = await client.player.createQueue(interaction.guild);

	if (!queue.connection) await queue.connect(interaction.member.voice.channel);

	let query = interaction.options.getString("song");
	//Serch with  by url first
	let result = await client.player.search(query, {
		requestedBy: interaction.user,
		searchEngine: QueryType.YOUTUBE_VIDEO,
	});
	//If the bot does not find songs by url, it proceeds to search by search term
	if (result.tracks.length === 0) {
		result = await client.player.search(query, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO,
		});
		if (result.tracks.length === 0)
			return await interaction.reply({
				embeds: [
					embedMsg
						.setColor(colors.danger)
						.setTitle("No songs found!")
						.setDescription("Try another song or adding additional information!"),
				],
				ephemeral: true,
			});
	}

	const song = result.tracks[0];
	await queue.addTrack(song);

	let positionQueue = queue.tracks.findIndex(track => {
		return track.id == result.tracks[0].id;
	});

	embedMsg
		.setColor(colors.success)
		.setAuthor({ name: "Add to the queue" })
		.setTitle(`${result.tracks[0].title}`)
		.setURL(`${result.tracks[0].url}`)
		.setThumbnail(`${result.tracks[0].thumbnail}`)
		.setFields(
			{ name: "Duration", value: `${result.tracks[0].duration}`, inline: true },
			{ name: "Position in the queue", value: `${positionQueue + 1}`, inline: true }
		)
		.setFooter({ text: `Next song in the queue: ${queue.tracks[0].title}` });

	if (!queue.playing) await queue.play();
	return await interaction.reply({
		embeds: [embedMsg],
	});
};

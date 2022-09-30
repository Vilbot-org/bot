const { QueryType } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

const configs = require("../../../../config.json");

module.exports = async (client, interaction) => {
	if (!interaction.member.voice.channel)
		return interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(configs.colors.danger).setTitle("You need to be in a voice channel!"),
			],
			ephemeral: true,
		});

	const embedMsg = new EmbedBuilder();

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
		if (result.tracks.length === 0) {
			embedMsg
				.setColor(configs.colors.danger)
				.setTitle("No songs found!")
				.setDescription("Try another song or adding additional information!");

			return await interaction.reply({
				embeds: [embedMsg],
			});
		}
	}

	const song = result.tracks[0];
	await queue.addTrack(song);

	let positionQueue = queue.tracks.findIndex(track => {
		return track.id == result.tracks[0].id;
	});

	embedMsg
		.setColor(configs.colors.success)
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
	await interaction.reply({
		embeds: [embedMsg],
	});
};

const { QueryType } = require("discord-player");

module.exports = async (client, interaction) => {
	if (!interaction.member.voice.channel) return interaction.reply("Need to be in a voice channel!");

	const queue = await client.player.createQueue(interaction.guild);

	if (!queue.connection) await queue.connect(interaction.member.voice.channel);

	//let embed = new MessageEmbed();

	let url = interaction.options.getString("track");
	const result = await client.player.search(url, {
		requestedBy: interaction.user,
		searchEngine: QueryType.YOUTUBE_VIDEO,
	});

	if (result.tracks.length === 0) return interaction.reply("No results");

	const song = result.tracks[0];
	await queue.addTrack(song);

	if (!queue.playing) await queue.play();
	await interaction.reply("reproduciendo");
};

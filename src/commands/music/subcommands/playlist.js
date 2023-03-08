const { EmbedBuilder } = require("discord.js");
const { Track } = require("discord-player");
const { colors } = require("../../../config.json");

const snipe = require("../../../schemas/UsersPlaylistsSchema");

module.exports = async (client, interaction) => {
	const channel = interaction.member.voice.channel;
	const playlistQuery = interaction.options.getString("playlist")
		? interaction.options.getString("playlist")
		: `${interaction.user.username}-playlist`;

	await interaction.deferReply();

	try {
		let playlist = await snipe.findOne({ userId: interaction.user.id, playlistName: playlistQuery });
		if (!playlist)
			return await interaction.reply({
				embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(":x: This playlist don't exist!")],
				ephemeral: true,
			});

		playlist = playlist.playlist;

		if (playlist.length == 0)
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(colors.danger)
						.setTitle(":x: This playlist don't have songs!")
						.setDescription(
							"You can add songs to this playlist with the following command: `/playlist add <song> " +
								playlistQuery +
								"`\nAdd songs and try again!"
						),
				],
				ephemeral: true,
			});

		const getSearchResults = async track => {
			const searchResult = await client.player.search(track.title);
			return searchResult.tracks[0];
		};

		const tracks = await Promise.all(
			playlist.map(async track => {
				return getSearchResults(track);
			})
		);

		const { queue } = await client.player.play(channel, tracks[0], {
			nodeOptions: {
				metadata: interaction,
				volume: 40,
			},
		});

		tracks.map(track => {
			queue.insertTrack(track, queue.getSize());
		});

		return interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setColor(colors.success)
					.setAuthor({ name: "Add to the queue" })
					.setTitle(`The ${playlistQuery} playlist`)
					.setThumbnail(interaction.user.avatarURL())
					.setFooter({ text: `${playlist.length} songs add.` }),
			],
		});
	} catch (e) {
		return interaction.followUp(`Something went wrong: ${e}`);
	}
};

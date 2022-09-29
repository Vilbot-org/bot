const Command = require("../../structures/Command");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "play",
			description: "Play a song in the voice channel!",
			options: [
				{
					name: "track",
					description: "The name of the track that you want to play!",
					type: 3,
					required: true,
				},
			],
		});
	}

	run = async interaction => {
		if (!interaction.member.voice.channel) return interaction.reply("Need to be in a voice channel!");
		/* if (!interaction.guild.me.voice.channel)
			return interaction.reply("Need to be in the same voice channel that the bot!"); */

		const player = this.client.manager.create({
			guild: interaction.guild.id,
			voiceChannel: interaction.member.voice.channel.id,
			textChannel: interaction.channel.id,
		});

		const search = interaction.options.getString("track");

		let res;
		console.log(
			await this.client.manager.search("https://www.youtube.com/watch?v=D9G1VOjN_84", interaction.user)
		);
		/* try {
		} catch (err) {
			return;
		} */
		/* try {
			console.log(res);
			if (res.loadType === "LOAD_FAILED") {
				if (!player.queue.current) player.destroy();

				throw res.exception;
			}
		} catch (err) {
			console.log("xd1");
			return interaction.reply(`Error to search the song!\n${err.message}`);
		}
		console.log("xd2"); */

		/* if (!res?.tracks?.[0]) return interaction.reply("Song not found!"); */

		if (player.state !== "CONNECTED") player.connect();

		player.queue.add(res.tracks[0]);

		if (!player.playing && !player.paused) player.play();

		return interaction.reply(`${res.tracks[0].tittle} add to the queue!`);
	};
};

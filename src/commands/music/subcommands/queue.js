const configs = require("../../../../config.json");

module.exports = async (client, interaction) => {
	let embedMsg = {
		type: "rich",
		title: "Music queue!",
		description: `Current songs in the queue: `,
	};

	const queue = client.player.getQueue(interaction.guildId);

	if (!queue || !queue.playing) {
		embedMsg.color = 0xff0201;
		embedMsg.fields = [
			{
				name: "No songs in the queue!",
				value: "\u200B",
			},
		];

		return interaction.reply({
			embeds: [embedMsg],
		});
	}

	const currentSong = queue.current;

	embedMsg.color = 0x00ffff;

	embedFields = [
		{
			name: "Current song: ",
			value: `${currentSong.title}`,
		},
		{
			name: "Queue:",
			value: "\u200B",
		},
	];

	console.log(queue.tracks);
	let auxIndex = 0;
	for (const track of queue.tracks) {
		let queueSong = {
			name: `${++auxIndex}. ${track.title}`,
			value: "\u200B",
			inline: true,
		};

		embedFields.push(queueSong);
	}

	embedMsg.fields = embedFields;
	embedMsg.footer = { text: `There are ${queue.tracks.length} songs in the queue` };

	interaction.reply({
		embeds: [embedMsg],
	});
};

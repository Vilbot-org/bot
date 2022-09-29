const { Manager } = require("erela.js");

module.exports = client => {
	return new Manager({
		nodes: [
			{
				host: "localhost",
				password: "P@ssword",
				port: 2333,
				retryDelay: 5000,
			},
		],
		send: (id, payload) => {
			const guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
	})
		.on("nodeConnect", node => console.log(`Node "${node.options.identifier}" connected.`))
		.on("nodeError", (node, error) =>
			console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
		)
		.on("trackStart", (player, track) => {
			const channel = client.channels.cache.get(player.textChannel);
			channel.send(`Now playing: \`${track.title}\`, requested by \`${track.requester.tag}\`.`);
		})
		.on("queueEnd", player => {
			const channel = client.channels.cache.get(player.textChannel);
			channel.send("Queue has ended.");
			player.destroy();
		});
};

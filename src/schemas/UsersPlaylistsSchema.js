const { Schema, model } = require("mongoose");

const UsersPlaylistsSchema = new Schema({
	userId: Number,
	playlistName: String,
	public: Boolean,
	playlist: Array,
});

module.exports = model("UsersPlaylists", UsersPlaylistsSchema);

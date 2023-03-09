import { Schema, model } from "mongoose";

const UsersPlaylistsSchema = new Schema({
	userId: Number,
	playlistName: String,
	public: Boolean,
	playlist: Array,
});

export default model("UsersPlaylists", UsersPlaylistsSchema);

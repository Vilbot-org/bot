import { Schema, model } from 'mongoose';

const UsersPlaylistsSchema = new Schema(
	{
		userId: {
			type: String,
			required: true
		},
		playlistName: {
			type: String,
			required: true
		},
		public: {
			type: Boolean,
			default: false
		},
		playlist: {
			type: Array,
			default: []
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
);

export default model('UsersPlaylists', UsersPlaylistsSchema);

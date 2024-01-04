const { Schema, model } = require('mongoose');

const playlistSchema = new Schema(
	{
		user: {
			type: String,
			ref: 'User'
		},
		name: {
			type: String,
			required: true
		},
		photo: {
			type: String,
			default: null
		},
		songs: {
			type: Array,
			default: []
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
);

const Playlist = model('Playlist', playlistSchema);

export default Playlist;

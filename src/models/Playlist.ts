import { Schema, model } from 'mongoose';
import { IPlaylist } from '@/types/IPlaylist';

const playlistSchema: Schema<IPlaylist> = new Schema(
	{
		user: {
			type: String,
			ref: 'User'
		},
		name: {
			type: String,
			required: true
		},
		tracks: {
			type: [String],
			default: []
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
);

const PlaylistModel = model('Playlist', playlistSchema);

export default PlaylistModel;

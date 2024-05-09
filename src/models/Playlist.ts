import { Schema, model } from 'mongoose';
import type { IPlaylist } from '@/interfaces/IPlaylist';

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

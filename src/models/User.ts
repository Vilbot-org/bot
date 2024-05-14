import type { IBotUser } from '@/types/IBot';
import { Schema, model } from 'mongoose';

const userSchema: Schema<IBotUser> = new Schema(
	{
		_id: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true
		},
		currentVoiceChannel: {
			type: Object,
			default: null
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
);

const User = model('User', userSchema);

export default User;

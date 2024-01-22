import { Schema, model } from 'mongoose';

const userSchema = new Schema(
	{
		_id: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true
		},
		voiceChannel: {
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

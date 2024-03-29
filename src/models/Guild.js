import { Schema, model } from 'mongoose';

const toObject = (activeVoiceUsers) => {
	return JSON.parse(activeVoiceUsers);
};

const schema = new Schema(
	{
		_id: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		activeVoiceUsers: {
			type: String,
			default: '{}',
			get: toObject
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
);

const Guild = model('Guild', schema);

export default Guild;

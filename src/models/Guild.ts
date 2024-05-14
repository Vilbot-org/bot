import { Schema, model } from 'mongoose';
import { IBotGuild } from '@/types/IBot';

const schema: Schema<IBotGuild> = new Schema(
	{
		_id: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
);

const GuildModel = model('Guild', schema);

export default GuildModel;

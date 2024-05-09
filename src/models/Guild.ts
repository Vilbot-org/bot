import { Schema, model } from 'mongoose';
import type { IBotGuild } from '@/interfaces/IBot';

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

import type { ChatInputCommandInteraction } from 'discord.js';
import type Command from '@/classes/Command';
import { getMember } from './guildUtils';

export interface PermissionResult {
	result: boolean;
	missing: string[];
}

export async function checkPermissions(
	command: Command,
	interaction: ChatInputCommandInteraction
): Promise<PermissionResult> {
	const member = await getMember(interaction);
	const requiredPermissions = command.getPermissions();

	if (requiredPermissions.length === 0) {
		return { result: true, missing: [] };
	}

	const missing = member.permissions.missing(requiredPermissions);

	return { result: !missing.length, missing };
}

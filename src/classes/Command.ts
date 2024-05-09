import BotError from '@/errors/BotError';
import type { ICommandOptions, ISubCommandObject } from '@/interfaces/IBot';
import { checkPermissions } from '@/utils/checkPermissions';
import errorHandler from '@/utils/errorHandler';
import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	PermissionResolvable,
	SlashCommandBuilder
} from 'discord.js';

class Command {
	private data: SlashCommandBuilder;
	private executeFn: (
		interaction: ChatInputCommandInteraction
	) => Promise<void>;
	private autocompleteFn:
		| ((interaction: AutocompleteInteraction) => Promise<void>)
		| null;
	private permissions: PermissionResolvable[];

	constructor(options: ICommandOptions) {
		this.data = new SlashCommandBuilder()
			.setName(options.name)
			.setDescription(options.description);
		this.executeFn = options.execute;
		this.autocompleteFn = options.autocomplete ?? null;
		this.permissions = options.permissions ?? [];

		if (options.subcommands) {
			this.addSubcommands(options.subcommands);
		}
	}

	getCommandData() {
		return this.data;
	}

	getPermissions() {
		return this.permissions;
	}

	addSubcommands(subcommands: ISubCommandObject[]) {
		subcommands.forEach((subcommandObject) => {
			this.data.addSubcommand((subcommand) => {
				subcommand
					.setName(subcommandObject.name)
					.setDescription(subcommandObject.description);

				if (subcommandObject.option) {
					const {
						name,
						description,
						required = false
					} = subcommandObject.option;

					subcommand.addStringOption((optionInput) =>
						optionInput
							.setName(name)
							.setDescription(description)
							.setRequired(required)
					);
				}

				return subcommand;
			});
		});
	}

	addStringOption(
		name: string,
		description: string,
		required = false,
		autocomplete = false
	) {
		this.data.addStringOption((option) =>
			option
				.setName(name)
				.setDescription(description)
				.setRequired(required)
				.setAutocomplete(autocomplete)
		);
	}

	async autocomplete(interaction: AutocompleteInteraction) {
		if (this.autocompleteFn) {
			try {
				await this.autocompleteFn(interaction);
			} catch (e) {
				errorHandler(interaction, e as BotError);
			}
		}
	}

	async execute(interaction: ChatInputCommandInteraction) {
		try {
			const permissionsCheck = await checkPermissions(this, interaction);

			if (!permissionsCheck.result) {
				throw new BotError(
					'No permissions',
					'No permissions',
					'You dont have permissions to exec this command.'
				);
			}

			await this.executeFn(interaction);
		} catch (e) {
			errorHandler(interaction, e as BotError);
		}
	}
}

export default Command;

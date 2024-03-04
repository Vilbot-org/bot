import help from '@/commands/info/help';
import createTestClient from 'tests/helpers';

describe('Discord bot command test', () => {
	let client;
	let mockInteraction;

	beforeEach(() => {
		client = createTestClient({ name: 'help', command: help });

		mockInteraction = {
			client,
			reply: jest.fn(),
			commandName: 'help'
		};
	});

	it('should reply when receiving a valid help command', async () => {
		await help.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith(expect.anything());
	});
});

import ping from '@/commands/info/ping';
import createTestClient from 'tests/helpers';

describe('Discord bot command ping', () => {
	let client;
	let mockInteraction;

	beforeEach(() => {
		client = createTestClient({ name: 'ping', command: ping });

		mockInteraction = {
			client,
			reply: jest.fn(),
			commandName: 'ping'
		};
	});

	it('should reply when receiving a valid ping command', async () => {
		await ping.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith(expect.anything());
	});
});

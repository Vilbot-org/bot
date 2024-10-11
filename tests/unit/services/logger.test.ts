import Logger from '../../../src/common/services/Logger';
import pino from 'pino';

jest.mock('pino');
const mockPino = pino as jest.MockedFunction<typeof pino>;
const mockChildLogger = {
	info: jest.fn(),
	error: jest.fn(),
	warn: jest.fn(),
	trace: jest.fn(),
	child: jest.fn().mockReturnThis()
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
mockPino.mockReturnValue(mockChildLogger as any);

describe('Logger Service', () => {
	const module = 'testModule';
	const name = 'testName';
	const message = 'Test message';
	const guildId = '12345';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should log info messages correctly', () => {
		const logger = new Logger(module, name, guildId);
		logger.info(message);
		expect(mockChildLogger.info).toHaveBeenCalledWith(message);
	});

	it('should log error messages correctly', () => {
		const logger = new Logger(module, name, guildId);
		logger.error(message);
		expect(mockChildLogger.error).toHaveBeenCalledWith(message);
	});

	it('should log warn messages correctly', () => {
		const logger = new Logger(module, name, guildId);
		logger.warn(message);
		expect(mockChildLogger.warn).toHaveBeenCalledWith(message);
	});

	it('should log trace messages correctly', () => {
		const logger = new Logger(module, name, guildId);
		logger.trace(message);
		expect(mockChildLogger.trace).toHaveBeenCalledWith(message);
	});

	it('should log info messages correctly using static method', () => {
		Logger.info(module, name, message, guildId);
		expect(mockChildLogger.child).toHaveBeenCalledWith({
			module,
			name,
			guildId
		});
		expect(mockChildLogger.info).toHaveBeenCalledWith(message);
	});

	it('should log error messages correctly using static method', () => {
		Logger.error(module, name, message, guildId);
		expect(mockChildLogger.child).toHaveBeenCalledWith({
			module,
			name,
			guildId
		});
		expect(mockChildLogger.error).toHaveBeenCalledWith(message);
	});

	it('should log warn messages correctly using static method', () => {
		Logger.warn(module, name, message, guildId);
		expect(mockChildLogger.child).toHaveBeenCalledWith({
			module,
			name,
			guildId
		});
		expect(mockChildLogger.warn).toHaveBeenCalledWith(message);
	});

	it('should log trace messages correctly using static method', () => {
		Logger.trace(module, name, message, guildId);
		expect(mockChildLogger.child).toHaveBeenCalledWith({
			module,
			name,
			guildId
		});
		expect(mockChildLogger.trace).toHaveBeenCalledWith(message);
	});
});

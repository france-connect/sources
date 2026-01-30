import { EnvService } from './env.service';

describe('EnvService', () => {
  let service: EnvService;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv };
    service = new EnvService();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return the value of an existing environment variable', () => {
      // Given
      process.env.TEST_VAR = 'test-value';

      // When
      const result = service.get('TEST_VAR');

      // Then
      expect(result).toBe('test-value');
    });

    it('should return empty string for a non-existing environment variable', () => {
      // Given
      delete process.env.NON_EXISTING_VAR;

      // When
      const result = service.get('NON_EXISTING_VAR');

      // Then
      expect(result).toBe('');
    });

    it('should return the default value for a non-existing environment variable', () => {
      // Given
      delete process.env.NON_EXISTING_VAR;

      // When
      const result = service.get('NON_EXISTING_VAR', 'default-value');

      // Then
      expect(result).toBe('default-value');
    });

    it('should return empty string if environment variable is set to empty string', () => {
      // Given
      process.env.EMPTY_VAR = '';

      // When
      const result = service.get('EMPTY_VAR', 'default-value');

      // Then
      expect(result).toBe('');
    });
  });
});

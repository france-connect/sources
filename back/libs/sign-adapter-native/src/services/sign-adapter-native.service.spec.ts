import { sign } from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';

import { SignAdapterNativeService } from './sign-adapter-native.service';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  sign: jest.fn(),
}));

describe('SignAdapterNativeService', () => {
  let service: SignAdapterNativeService;

  const signMock = jest.mocked(sign);
  const signature = Symbol('signature') as unknown as void;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SignAdapterNativeService],
    }).compile();

    service = module.get<SignAdapterNativeService>(SignAdapterNativeService);

    signMock.mockReturnValue(signature);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('should call sign with data, alg, and key', async () => {
      // When
      await service.sign('data', 'ES256', 'key');

      // Then
      expect(signMock).toHaveBeenCalledWith(
        'sha256',
        Buffer.from('data'),
        'key',
      );
    });

    it('should return the result of sign', async () => {
      // When
      const result = await service.sign('data', 'alg', 'key');

      // Then
      expect(result).toBe(signature);
    });
  });
});

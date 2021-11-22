import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';

import { CryptographyEidasService } from './cryptography-eidas.service';
import { IPivotIdentity } from './interfaces';

describe('CryptographyEidasService', () => {
  let service: CryptographyEidasService;

  const configMock = {
    get: jest.fn(),
  };
  const mockEncryptKey = 'p@ss p@rt0ut';
  const cryptographyKeyMock = 'Méfaits accomplis...';

  const cryptographyServiceMock = {
    hash: jest.fn(),
    decrypt: jest.fn(),
  };
  const pivotIdentityMock: Pick<IPivotIdentity, 'sub'> = {
    sub: 'BE/FR/123456789',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptographyService, ConfigService, CryptographyEidasService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyServiceMock)
      .compile();

    service = module.get<CryptographyEidasService>(CryptographyEidasService);

    configMock.get.mockImplementation(() => ({
      // Cryptography config
      clientSecretEncryptKey: mockEncryptKey,
      sessionIdLength: 42,
      subSecretKey: cryptographyKeyMock,
    }));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('computeIdentityHash', () => {
    it('should call cryptography service hash function with given parameters', () => {
      // Given
      const serial = 'BE/FR/123456789';
      const inputEncoding = 'binary';
      const alg = 'sha256';
      const ouputDigest = 'base64';
      cryptographyServiceMock.hash.mockReturnValueOnce('totoIsHashed');
      // action
      const result = service.computeIdentityHash(pivotIdentityMock);

      // expect
      expect(cryptographyServiceMock.hash).toHaveBeenCalledTimes(1);
      expect(cryptographyServiceMock.hash).toHaveBeenCalledWith(
        serial,
        inputEncoding,
        alg,
        ouputDigest,
      );
      expect(result).toEqual('totoIsHashed');
    });
  });

  describe('computeSubV1', () => {
    const providerRefMock = 'providerRefMockValue';
    const identityHashMock = 'identityHashValue';

    it('should crypto service hash function with joined parameters', () => {
      cryptographyServiceMock.hash.mockReturnValueOnce('totoHasASub');
      // action
      const result = service.computeSubV1(providerRefMock, identityHashMock);

      // expect
      expect(cryptographyServiceMock.hash).toHaveBeenCalledTimes(1);
      expect(cryptographyServiceMock.hash).toHaveBeenCalledWith(
        'providerRefMockValue' + 'identityHashValue' + 'Méfaits accomplis...',
      );
      expect(result).toEqual('totoHasASubv1');
    });
  });
});

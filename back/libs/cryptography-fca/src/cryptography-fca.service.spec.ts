import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';

import { CryptographyFcaService } from './cryptography-fca.service';
import { IAgentIdentity } from './interfaces';

describe('CryptographyFcaService', () => {
  let service: CryptographyFcaService;

  const configMock = {
    get: jest.fn(),
  };
  const mockEncryptKey = 'p@ss p@rt0ut';
  const cryptographyKeyMock = 'Méfaits accomplis...';
  const cryptoHashKeyMock = 'alea jacta est';
  const idpIdMock = 'idpIdValue';

  const cryptographyServiceMock = {
    hash: jest.fn(),
    decrypt: jest.fn(),
  };
  const agentIdentityMock: IAgentIdentity = {
    sub: '222AF4567DCB775433211',
    // scope openid @see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Jean Paul',

    // Agent Connect defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    usual_name: 'Henri',
    uid: 'XE3334RFFG54321ZZ2ED',
    email: 'jean.paul@henry.com',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptographyService, ConfigService, CryptographyFcaService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyServiceMock)
      .compile();

    service = module.get<CryptographyFcaService>(CryptographyFcaService);

    configMock.get.mockImplementation(() => ({
      // Cryptography config
      clientSecretEncryptKey: mockEncryptKey,
      sessionIdLength: 42,
      subSecretKey: cryptographyKeyMock,
      hashSecretKey: cryptoHashKeyMock,
    }));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('computeIdentityHash', () => {
    it('should call cryptography service hash function with given parameters', () => {
      // Given
      const serial = 'idpIdValue' + 'XE3334RFFG54321ZZ2ED' + 'alea jacta est';
      const inputEncoding = 'binary';
      const alg = 'sha256';
      const ouputDigest = 'base64';
      cryptographyServiceMock.hash.mockReturnValueOnce('totoIsHashed');
      // action
      const result = service.computeIdentityHash(idpIdMock, agentIdentityMock);

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
      expect(result).toEqual('totoHasASub');
    });
  });
});

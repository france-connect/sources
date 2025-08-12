import * as crypto from 'crypto';

import * as pkcs11js from 'pkcs11js';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { SignatureDigest } from './enums';
import { HsmService } from './hsm.service';

/**
 *  Support EC key prime field up to 521 bits
 *  @see https://en.wikipedia.org/wiki/Elliptic-curve_cryptography
 *  /!\ Do not modify without understanding the basics of the upper link /!\
 */
const MAX_SIG_OUTPUT_SIZE = 132;

describe('HsmService', () => {
  let service: HsmService;

  const virtualHsmSlot = 42;

  const mockError = new Error('E_INIT');

  // Camel case is disabled here beacause of PKCS#11 implementation
  const mockPkcs11Instance = {
    load: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_Initialize: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_GetSlotList: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_OpenSession: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_Login: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_SignInit: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_Sign: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_FindObjectsInit: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_FindObjects: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_FindObjectsFinal: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_Logout: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_CloseSession: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_Finalize: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C_GenerateRandom: jest.fn(),
  };

  const mockPin = 'admin';
  const mockLibHsmPath = '/etc/hsm/libnethsm.so';

  const mockSlotList = [];
  /** insert the mock at index "virtualHsmSlot" */
  mockSlotList.splice(virtualHsmSlot, 0, Buffer.from('*'));

  const mockKeySlot = Buffer.from('0');

  const mockHsmSession = 'If you concentrate you can imagine this is a session';

  const mockRandomValue = Buffer.from('mockRandomValue');
  const mockData = Buffer.from('The cake is a lie !', 'utf8');
  const sha256Digest = Buffer.from(
    '59d2da2a2781004e917f3aaadf7ac9b0db31bcf81fbcf7ed391227b18bd7ff22',
    'hex',
  );

  const sigKeyCkaLabel = 'sig-key-prime256v1';

  const mockRawSignature = Buffer.from('raw', 'utf8');

  const configServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    jest.spyOn(pkcs11js, 'PKCS11').mockImplementation(function mockPkcs11() {
      return mockPkcs11Instance as unknown as pkcs11js.PKCS11;
    });

    jest.spyOn(crypto, 'createHash');
    jest.spyOn(crypto.Hash.prototype, 'update');
    jest.spyOn(crypto.Hash.prototype, 'digest');

    configServiceMock.get.mockImplementation((module) => {
      switch (module) {
        case 'Hsm':
          return {
            libhsm: mockLibHsmPath,
            pin: mockPin,
            virtualHsmSlot,
            sigKeyCkaLabel,
          };
      }
    });

    mockPkcs11Instance.C_GetSlotList.mockReturnValue(mockSlotList);

    const module: TestingModule = await Test.createTestingModule({
      providers: [HsmService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<HsmService>(HsmService);
    // The testing module is not calling application lifecycle hooks
    service.onModuleInit();

    // Will reset the counts altered by the "onModuleInit" call
    jest.clearAllMocks();

    service.shutdownConsumer = jest.fn();

    mockPkcs11Instance.C_GenerateRandom.mockReturnValue(mockRandomValue);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call instanciatePkcs11js with the shared library', () => {
      service['instanciatePkcs11js'] = jest.fn();
      service['openSessionWithTheHsm'] = jest.fn();
      service['authenticateWithTheHsm'] = jest.fn();

      // When
      service.onModuleInit();

      // Then
      expect(service['instanciatePkcs11js']).toHaveBeenCalledTimes(1);
      expect(service['instanciatePkcs11js']).toHaveBeenCalledWith(
        mockLibHsmPath,
      );
    });

    it('should store the PKCS#11 instance in a private attribute', () => {
      service['instanciatePkcs11js'] = jest
        .fn()
        .mockReturnValueOnce(mockPkcs11Instance);
      service['openSessionWithTheHsm'] = jest.fn();
      service['authenticateWithTheHsm'] = jest.fn();

      // When
      service.onModuleInit();

      // Then
      expect(service['pkcs11Instance']).toBe(mockPkcs11Instance);

      // restore
    });

    it('should call openSessionWithTheHsm', () => {
      service['instanciatePkcs11js'] = jest.fn();
      service['openSessionWithTheHsm'] = jest.fn();
      service['authenticateWithTheHsm'] = jest.fn();

      // When
      service.onModuleInit();

      // Then
      expect(service['openSessionWithTheHsm']).toHaveBeenCalledTimes(1);
    });

    it('should store the PKCS#11 session it in a private attribute', () => {
      // Given
      service['instanciatePkcs11js'] = jest.fn();
      service['openSessionWithTheHsm'] = jest
        .fn()
        .mockReturnValueOnce(mockHsmSession);
      service['authenticateWithTheHsm'] = jest.fn();

      // When
      service.onModuleInit();

      // Then
      expect(service['pkcs11Session']).toStrictEqual(mockHsmSession);
    });

    it('should call authenticateWithTheHsm', () => {
      service['instanciatePkcs11js'] = jest.fn();
      service['openSessionWithTheHsm'] = jest.fn();
      service['authenticateWithTheHsm'] = jest.fn();

      // When
      service.onModuleInit();

      // Then
      expect(service['authenticateWithTheHsm']).toHaveBeenCalledTimes(1);
    });

    it('should call handleError with the error thrown by instanciatePkcs11js', () => {
      service['handleError'] = jest.fn();
      service['instanciatePkcs11js'] = jest.fn().mockImplementationOnce(() => {
        throw mockError;
      });
      service['openSessionWithTheHsm'] = jest.fn();
      service['authenticateWithTheHsm'] = jest.fn();

      // When
      service.onModuleInit();

      // Then
      expect(service['handleError']).toHaveBeenCalledTimes(1);
      expect(service['handleError']).toHaveBeenCalledWith(mockError);
    });

    it('should call handleError with the error thrown by openSessionWithTheHsm', () => {
      service['handleError'] = jest.fn();
      service['instanciatePkcs11js'] = jest.fn();
      service['openSessionWithTheHsm'] = jest
        .fn()
        .mockImplementationOnce(() => {
          throw mockError;
        });
      service['authenticateWithTheHsm'] = jest.fn();

      // When
      service.onModuleInit();

      // Then
      expect(service['handleError']).toHaveBeenCalledTimes(1);
      expect(service['handleError']).toHaveBeenCalledWith(mockError);
    });

    it('should call handleError with the error thrown by authenticateWithTheHsm', () => {
      service['handleError'] = jest.fn();
      service['instanciatePkcs11js'] = jest.fn();
      service['openSessionWithTheHsm'] = jest.fn();
      service['authenticateWithTheHsm'] = jest
        .fn()
        .mockImplementationOnce(() => {
          throw mockError;
        });

      // When
      service.onModuleInit();

      // Then
      expect(service['handleError']).toHaveBeenCalledTimes(1);
      expect(service['handleError']).toHaveBeenCalledWith(mockError);
    });
  });

  describe('onModuleClose', () => {
    it('should call closeCurrentSessionWithTheHsm without argument', () => {
      // Given
      service['closeCurrentSessionWithTheHsm'] = jest.fn();

      // When
      service.onModuleDestroy();

      // Then
      expect(service['closeCurrentSessionWithTheHsm']).toHaveBeenCalledTimes(1);
      expect(service['closeCurrentSessionWithTheHsm']).toHaveBeenCalledWith();
    });
  });

  describe('sign', () => {
    it('should hash the data with the given digest algo prior to sign', () => {
      // Given
      mockPkcs11Instance.C_Sign.mockReturnValueOnce(mockRawSignature);

      // When
      service['sign'](mockData);

      // Then
      expect(crypto.createHash).toHaveBeenCalledTimes(1);
      expect(crypto.createHash).toHaveBeenCalledWith(SignatureDigest.SHA256);
      expect(crypto.Hash.prototype.update).toHaveBeenCalledTimes(1);
      expect(crypto.Hash.prototype.update).toHaveBeenCalledWith(mockData);
      expect(crypto.Hash.prototype.digest).toHaveBeenCalledTimes(1);
    });

    it('should call getPrivateKeySlotByLabel with the given CKA_LABEL', () => {
      // Given
      mockPkcs11Instance.C_Sign.mockReturnValueOnce(mockRawSignature);
      const originalGetPrivateKeySlotByLabel =
        service['getPrivateKeySlotByLabel'];
      service['getPrivateKeySlotByLabel'] = jest.fn();

      // When
      service['sign'](mockData);

      // Then
      expect(service['getPrivateKeySlotByLabel']).toHaveBeenCalledTimes(1);
      expect(service['getPrivateKeySlotByLabel']).toHaveBeenCalledWith(
        sigKeyCkaLabel,
      );

      // restore
      service['getPrivateKeySlotByLabel'] = originalGetPrivateKeySlotByLabel;
    });

    it('should call C_SignInit with the PKCS#11 session, the CKM_ECDSA mekanism and the key slot returned by getPrivateKeySlotByLabel', () => {
      // Given
      mockPkcs11Instance.C_Sign.mockReturnValueOnce(mockRawSignature);
      const originalGetPrivateKeySlotByLabel =
        service['getPrivateKeySlotByLabel'];
      service['getPrivateKeySlotByLabel'] = jest
        .fn()
        .mockReturnValueOnce(mockKeySlot);

      // When
      service['sign'](mockData);

      // Then
      expect(mockPkcs11Instance.C_SignInit).toHaveBeenCalledTimes(1);
      expect(mockPkcs11Instance.C_SignInit).toHaveBeenCalledWith(
        service['pkcs11Session'],
        {
          mechanism: pkcs11js.CKM_ECDSA,
        },
        mockKeySlot,
      );

      // restore
      service['getPrivateKeySlotByLabel'] = originalGetPrivateKeySlotByLabel;
    });

    it('should call C_Sign with the PKCS#11 session, the dataDigest, and a Buffer sizeof MAX_SIG_OUTPUT_SIZE', () => {
      // Given
      mockPkcs11Instance.C_Sign.mockReturnValueOnce(mockRawSignature);

      // When
      service['sign'](mockData);

      // Then
      expect(mockPkcs11Instance.C_Sign).toHaveBeenCalledTimes(1);
      expect(mockPkcs11Instance.C_Sign).toHaveBeenCalledWith(
        service['pkcs11Session'],
        sha256Digest,
        Buffer.alloc(MAX_SIG_OUTPUT_SIZE),
      );
    });

    it('should returnthe signature to RAW (r, s) format', () => {
      // Given
      mockPkcs11Instance.C_Sign.mockReturnValueOnce(mockRawSignature);
      // When
      const result = service['sign'](mockData);

      // Then
      expect(result).toStrictEqual(mockRawSignature);
    });

    it('should call "handleError" with a "E_SIG_NOT_FOUND" error if C_Sign does not return a Buffer', () => {
      // Given
      const expectedError = new Error('E_SIG_NOT_FOUND');
      mockPkcs11Instance.C_Sign.mockReturnValueOnce(undefined);
      service['handleError'] = jest.fn();

      // When
      service['sign'](mockData);
      expect(service['handleError']).toHaveBeenCalledTimes(1);
      expect(service['handleError']).toHaveBeenCalledWith(expectedError);

      // Then
      expect.hasAssertions();
    });

    it('should not catch the error if "handleError" throws', () => {
      // Given
      mockPkcs11Instance.C_Sign.mockReturnValueOnce(undefined);
      service['handleError'] = jest.fn().mockImplementationOnce(() => {
        throw new Error('E_SIG');
      });

      // When
      try {
        service['sign'](mockData);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toStrictEqual('E_SIG');
      }

      // Then
      expect.hasAssertions();
    });

    it('should call "handleError" with a "E_SIG_NOT_FOUND" error if C_Sign returns an empty Buffer', () => {
      const expectedError = new Error('E_SIG_NOT_FOUND');
      mockPkcs11Instance.C_Sign.mockReturnValueOnce(Buffer.alloc(0));
      service['handleError'] = jest.fn();

      // When
      service['sign'](mockData);
      expect(service['handleError']).toHaveBeenCalledTimes(1);
      expect(service['handleError']).toHaveBeenCalledWith(expectedError);

      // Then
      expect.hasAssertions();
    });
  });

  describe('genRandom', () => {
    it('should call PKCS#11 C_GenerateRandom with session', () => {
      // Given
      service['pkcs11Session'] = Buffer.from('mock value');
      const size = 32;
      const encoding = 'hex';
      // When
      service.genRandom(size, encoding);
      // Then
      expect(mockPkcs11Instance.C_GenerateRandom).toHaveBeenCalledTimes(1);
      expect(mockPkcs11Instance.C_GenerateRandom).toHaveBeenCalledWith(
        service['pkcs11Session'],
        expect.any(Buffer),
      );
    });
  });

  describe('instanciatePkcs11js', () => {
    it('should create a PKCS#11 Instance', () => {
      // When
      service['instanciatePkcs11js'](mockLibHsmPath);

      // Then
      expect(pkcs11js.PKCS11).toHaveBeenCalledTimes(1);
      expect(pkcs11js.PKCS11).toHaveBeenCalledWith();
    });

    it('should load the nethsm library', () => {
      // When
      service['instanciatePkcs11js'](mockLibHsmPath);

      // Then
      expect(mockPkcs11Instance.load).toHaveBeenCalledTimes(1);
      expect(mockPkcs11Instance.load).toHaveBeenCalledWith(mockLibHsmPath);
    });

    it('should initialize the PKCS#11 instance', () => {
      // When
      service['instanciatePkcs11js'](mockLibHsmPath);

      // Then
      expect(mockPkcs11Instance.C_Initialize).toHaveBeenCalledTimes(1);
    });

    it('should return the PKCS#11 Instance', () => {
      // When
      const result = service['instanciatePkcs11js'](mockLibHsmPath);

      // Then
      expect(result).toBe(mockPkcs11Instance);
    });
  });

  describe('openSessionWithTheHsm', () => {
    it('should retrieve the virtualHsmSlot from config', () => {
      const configName = 'Hsm';

      // When
      service['openSessionWithTheHsm']();

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith(configName);
    });

    it('should retrieve only the slots with tokens from the PKCS#11 instance', () => {
      const tokenPresent = true;

      // When
      service['openSessionWithTheHsm']();

      // Then
      expect(mockPkcs11Instance.C_GetSlotList).toHaveBeenCalledTimes(1);
      expect(mockPkcs11Instance.C_GetSlotList).toHaveBeenCalledWith(
        tokenPresent,
      );
    });

    it('should open a read-only session with the virtualHsmSlot retrieved from config', () => {
      // When
      service['openSessionWithTheHsm']();

      // Then
      expect(mockPkcs11Instance.C_OpenSession).toHaveBeenCalledTimes(1);
      expect(mockPkcs11Instance.C_OpenSession).toHaveBeenCalledWith(
        mockSlotList[virtualHsmSlot],
        pkcs11js.CKF_SERIAL_SESSION,
      );
    });

    it('should return the PKCS#11 session', () => {
      // Given
      mockPkcs11Instance.C_OpenSession.mockReturnValueOnce(mockHsmSession);

      // When
      const result = service['openSessionWithTheHsm']();

      // Then
      expect(result).toStrictEqual(mockHsmSession);
    });
  });

  describe('closeCurrentSessionWithTheHsm', () => {
    it('should call C_Logout to logout from the hsm', () => {
      // When
      service['closeCurrentSessionWithTheHsm']();

      // Then
      expect(mockPkcs11Instance.C_Logout).toHaveBeenCalledTimes(1);
    });

    it('should call C_CloseSession to close the current session', () => {
      // When
      service['closeCurrentSessionWithTheHsm']();

      // Then
      expect(mockPkcs11Instance.C_CloseSession).toHaveBeenCalledTimes(1);
    });

    it('should call C_Finalize to destroy the instance', () => {
      // When
      service['closeCurrentSessionWithTheHsm']();

      // Then
      expect(mockPkcs11Instance.C_Finalize).toHaveBeenCalledTimes(1);
    });
  });

  describe('authenticateWithTheHsm', () => {
    it('should call C_Login with the HSM session, the user type "CKU_USER" and the mockPin', () => {
      // When
      service['authenticateWithTheHsm']();

      // Then
      expect(mockPkcs11Instance.C_Login).toHaveBeenCalledTimes(1);
      expect(mockPkcs11Instance.C_Login).toHaveBeenCalledWith(
        service['pkcs11Session'],
        pkcs11js.CKU_USER,
        mockPin,
      );
    });
  });

  describe('getPrivateKeySlotByLabel', () => {
    it('should return the first matching slot', () => {
      // Given
      mockPkcs11Instance.C_FindObjects.mockReturnValueOnce(mockKeySlot);

      // When
      const result = service['getPrivateKeySlotByLabel'](sigKeyCkaLabel);

      // Then
      expect(result).toBe(mockKeySlot);
    });

    it('C_FindObjectsInit shall have been called with the PKCS#11 session, the key type "private" and the key label', () => {
      // Given
      const expectedTemplate = [
        {
          type: pkcs11js.CKA_KEY_TYPE,
          value: pkcs11js.CKO_PRIVATE_KEY,
        },
        {
          type: pkcs11js.CKA_LABEL,
          value: Buffer.from(sigKeyCkaLabel, 'utf8'),
        },
        { type: pkcs11js.CKA_SIGN, value: true },
      ];

      // When
      service['getPrivateKeySlotByLabel'](sigKeyCkaLabel);

      // Then
      expect(mockPkcs11Instance.C_FindObjectsInit).toHaveBeenCalledTimes(1);
      expect(mockPkcs11Instance.C_FindObjectsInit).toHaveBeenCalledWith(
        service['pkcs11Session'],
        expectedTemplate,
      );
    });

    it('C_FindObjects shall have been called with the PKCS#11 session', () => {
      // When
      service['getPrivateKeySlotByLabel'](sigKeyCkaLabel);

      // Then
      expect(mockPkcs11Instance.C_FindObjects).toHaveBeenCalledTimes(1);
      expect(mockPkcs11Instance.C_FindObjects).toHaveBeenCalledWith(
        service['pkcs11Session'],
      );
    });

    it('C_FindObjectsFinal shall have been called with the PKCS#11 session', () => {
      // When
      service['getPrivateKeySlotByLabel'](sigKeyCkaLabel);

      // Then
      expect(mockPkcs11Instance.C_FindObjectsFinal).toHaveBeenCalledTimes(1);
      expect(mockPkcs11Instance.C_FindObjectsFinal).toHaveBeenCalledWith(
        service['pkcs11Session'],
      );
    });

    it('C_FindObjectsFinal shall have been called with the PKCS#11 session even if C_FindObjects throws', () => {
      // Given
      mockPkcs11Instance.C_FindObjects.mockImplementationOnce(() => {
        throw new Error('C_FindObjects throw');
      });

      // When
      try {
        service['getPrivateKeySlotByLabel'](sigKeyCkaLabel);
        // You can't remove the catch argument, it's mandatory
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // Then
        expect(mockPkcs11Instance.C_FindObjectsFinal).toHaveBeenCalledTimes(1);
        expect(mockPkcs11Instance.C_FindObjectsFinal).toHaveBeenCalledWith(
          service['pkcs11Session'],
        );
      }

      // Then
      expect.hasAssertions();
    });

    it('should throw C_FindObjects error if C_FindObjects throws', () => {
      // Given
      mockPkcs11Instance.C_FindObjects.mockImplementationOnce(() => {
        throw new Error('C_FindObjects throw');
      });

      // When
      try {
        service['getPrivateKeySlotByLabel'](sigKeyCkaLabel);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('C_FindObjects throw');
      }

      // Then
      expect.hasAssertions();
    });
  });

  describe('handleError', () => {
    it('should call "shutdownConsumer" without argument if the error that is a CKR_DEVICE_ERROR', () => {
      // Given
      const error = new Error('CKR_DEVICE_ERROR:48');

      // When
      service['handleError'](error);
      expect(service.shutdownConsumer).toHaveBeenCalledTimes(1);
      expect(service.shutdownConsumer).toHaveBeenCalledWith();

      // Then
      expect.hasAssertions();
    });

    it('should throw any error that is not a CKR_DEVICE_ERROR', () => {
      // Given
      const error = new Error('???');

      // When
      try {
        service['handleError'](error);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual(error.message);
      }

      // Then
      expect.hasAssertions();
    });
  });
});

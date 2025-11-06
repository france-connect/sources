import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';

import { SignAdapterHsmService } from './sign-adapter-hsm.service';

describe('SignAdapterHsmService', () => {
  let service: SignAdapterHsmService;

  const configServiceMock = getConfigMock();

  const csmrHsmClientServiceMock = {
    sign: jest.fn(),
  };

  const encoding = 'base64';
  const csmrHsmResult = Buffer.from('csmrHsmResult');

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignAdapterHsmService,
        ConfigService,
        {
          provide: 'CsmrHsmClient',
          useValue: csmrHsmClientServiceMock,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<SignAdapterHsmService>(SignAdapterHsmService);

    configServiceMock.get.mockReturnValue({ payloadEncoding: encoding });
    csmrHsmClientServiceMock.sign.mockResolvedValue(csmrHsmResult);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('should fetch the payload encoding from the config', async () => {
      // When
      await service.sign('some string', 'ES256');

      // Then
      expect(configServiceMock.get).toHaveBeenCalledWith(
        'CsmrHsmClientMicroService',
      );
    });

    it('should call csmrHsmClientService.sign with message', async () => {
      // When
      await service.sign('some string', 'ES256');

      // Then
      expect(csmrHsmClientServiceMock.sign).toHaveBeenCalledWith(
        'some string',
        'ES256',
        encoding,
      );
    });

    it('should return result of csmrHsmClientService.sign', async () => {
      // When
      const result = await service.sign('some string', 'ES256');

      // Then
      expect(result).toBe(csmrHsmResult);
      expect(csmrHsmClientServiceMock.sign).toHaveBeenCalledWith(
        'some string',
        'ES256',
        encoding,
      );
    });
  });
});

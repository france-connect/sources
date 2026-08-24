import { Test, TestingModule } from '@nestjs/testing';

import { PublicationStatusEnum } from '@entities/typeorm';

import {
  ActionTypes,
  ConfigCreateViaMessageDtoPayload,
} from '@fc/csmr-config-client';
import { PartnersServiceProviderInstanceVersionService } from '@fc/partners-service-provider-instance-version';

import { PartnerPublicationService } from './partners-publication.service';

describe('PartnerPublicationService', () => {
  let service: PartnerPublicationService;

  const csmrConfigClientMock = {
    publish: jest.fn(),
  };

  const versionMock = {
    updateStatus: jest.fn(),
  };

  const instanceId = 'instanceId';
  const versionId = 'versionId';
  const payload = {
    key: 'value',
  } as unknown as ConfigCreateViaMessageDtoPayload;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnerPublicationService,
        PartnersServiceProviderInstanceVersionService,
        {
          provide: 'ConfigSandboxLow',
          useValue: csmrConfigClientMock,
        },
      ],
    })
      .overrideProvider(PartnersServiceProviderInstanceVersionService)
      .useValue(versionMock)
      .compile();

    service = module.get<PartnerPublicationService>(PartnerPublicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publish', () => {
    it.each([
      ActionTypes.CONFIG_CREATE,
      ActionTypes.CONFIG_UPDATE,
      ActionTypes.CONFIG_DELETE,
    ])(
      'should call csmrConfigClient.publish with a %s message',
      async (type) => {
        // When
        await service.publish(instanceId, versionId, payload, type);

        // Then
        expect(csmrConfigClientMock.publish).toHaveBeenCalledExactlyOnceWith({
          type,
          meta: {
            instanceId,
            versionId,
            publicationStatus: PublicationStatusEnum.PENDING,
          },
          payload,
        });
      },
    );

    it('should return the result of csmrConfigClient.publish', async () => {
      // Given
      const publishResult = Symbol('publishResult');
      csmrConfigClientMock.publish.mockResolvedValueOnce(publishResult);

      // When
      const result = await service.publish(
        instanceId,
        versionId,
        payload,
        ActionTypes.CONFIG_CREATE,
      );

      // Then
      expect(result).toBe(publishResult);
    });

    it('should update the version status to FAILED if publication fails', async () => {
      // Given
      csmrConfigClientMock.publish.mockRejectedValueOnce(new Error('error'));

      // When
      await expect(
        service.publish(
          instanceId,
          versionId,
          payload,
          ActionTypes.CONFIG_CREATE,
        ),
      ).rejects.toThrow('error');

      // Then
      expect(versionMock.updateStatus).toHaveBeenCalledExactlyOnceWith({
        id: versionId,
        publicationStatus: PublicationStatusEnum.FAILED,
      });
    });

    it('should rethrow the error if publication fails', async () => {
      // Given
      const errorMock = new Error('error');
      csmrConfigClientMock.publish.mockRejectedValueOnce(errorMock);

      // When / Then
      await expect(
        service.publish(
          instanceId,
          versionId,
          payload,
          ActionTypes.CONFIG_CREATE,
        ),
      ).rejects.toThrow(errorMock);
    });
  });
});

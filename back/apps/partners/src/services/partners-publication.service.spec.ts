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

  beforeEach(async () => {
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
    it('should call csmrConfigClient.publish with correct params', async () => {
      // Given
      const instanceId = 'instanceId';
      const versionId = 'versionId';
      const payload = {
        key: 'value',
      } as unknown as ConfigCreateViaMessageDtoPayload;
      const type = ActionTypes.CONFIG_CREATE;

      // When
      await service.publish(instanceId, versionId, payload, type);

      // Then
      expect(csmrConfigClientMock.publish).toHaveBeenCalledWith({
        type,
        meta: {
          instanceId,
          versionId,
          publicationStatus: PublicationStatusEnum.PENDING,
        },
        payload,
      });
    });

    it('should update status if publication fails', async () => {
      // Given
      const instanceId = 'instanceId';
      const versionId = 'versionId';
      const payload = {
        key: 'value',
      } as unknown as ConfigCreateViaMessageDtoPayload;
      const type = ActionTypes.CONFIG_CREATE;
      csmrConfigClientMock.publish.mockRejectedValue(new Error('error'));

      // When
      try {
        await service.publish(instanceId, versionId, payload, type);
        // You can't remove the catch argument, it's mandatory
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Then
        expect(versionMock.updateStatus).toHaveBeenCalledExactlyOnceWith({
          id: versionId,
          publicationStatus: PublicationStatusEnum.FAILED,
        });
      }
    });
  });
});

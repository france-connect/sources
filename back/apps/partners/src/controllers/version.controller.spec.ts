import { Test, TestingModule } from '@nestjs/testing';

import { AccessControlGuard } from '@fc/access-control';
import { MetadataFormService } from '@fc/dto2form';
import { ServiceProviderInstanceVersionDto } from '@fc/partners-service-provider-instance-version';

import { PartnersI18nService } from '../services';
import { VersionController } from './version.controller';

describe('VersionController', () => {
  let controller: VersionController;

  const metadataFormServiceMock = {
    getDtoMetadata: jest.fn(),
  };

  const partnersI18nServiceMock = {
    translation: jest.fn(),
  };

  const rolesGuardMock = {
    canActivate: () => true,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VersionController],
      providers: [MetadataFormService, PartnersI18nService],
    })
      .overrideProvider(MetadataFormService)
      .useValue(metadataFormServiceMock)
      .overrideProvider(PartnersI18nService)
      .useValue(partnersI18nServiceMock)
      .overrideGuard(AccessControlGuard)
      .useValue(rolesGuardMock)
      .compile();

    controller = module.get<VersionController>(VersionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFormMetadata', () => {
    const payloadMock = Symbol('payload');

    beforeEach(() => {
      metadataFormServiceMock.getDtoMetadata.mockReturnValueOnce(payloadMock);

      partnersI18nServiceMock.translation.mockReturnValueOnce(payloadMock);
    });

    it('should call getDtoMetadata to retrieve metadata', () => {
      // When
      const _result = controller.getFormMetadata();

      // Then
      expect(
        metadataFormServiceMock.getDtoMetadata,
      ).toHaveBeenCalledExactlyOnceWith(ServiceProviderInstanceVersionDto);
    });

    it('should call replaceWithI18n to retrieve paylaod with i18n translation', () => {
      // When
      const _result = controller.getFormMetadata();

      // Then
      expect(
        partnersI18nServiceMock.translation,
      ).toHaveBeenCalledExactlyOnceWith(payloadMock);
    });

    it('should return payload translate', () => {
      // When
      const result = controller.getFormMetadata();

      // Then
      expect(result).toEqual(payloadMock);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { AccessControlGuard } from '@fc/access-control';
import { MetadataFormService } from '@fc/dto2form';
import { ServiceProviderInstanceVersionDto } from '@fc/partners-service-provider-instance-version';

import { VersionController } from './version.controller';

describe('VersionController', () => {
  let controller: VersionController;

  const metadataFormServiceMock = {
    getDtoMetadata: jest.fn(),
  };

  const rolesGuardMock = {
    canActivate: () => true,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VersionController],
      providers: [MetadataFormService],
    })
      .overrideProvider(MetadataFormService)
      .useValue(metadataFormServiceMock)
      .overrideGuard(AccessControlGuard)
      .useValue(rolesGuardMock)
      .compile();

    controller = module.get<VersionController>(VersionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFormMetadata', () => {
    it('should call getDtoMetadata to retrieve metadata', () => {
      // Given
      const payloadMock = Symbol('payload');
      metadataFormServiceMock.getDtoMetadata.mockReturnValueOnce(payloadMock);

      // When
      const result = controller.getFormMetadata();

      // Then
      expect(
        metadataFormServiceMock.getDtoMetadata,
      ).toHaveBeenCalledExactlyOnceWith(ServiceProviderInstanceVersionDto);
      expect(result).toEqual(payloadMock);
    });
  });
});

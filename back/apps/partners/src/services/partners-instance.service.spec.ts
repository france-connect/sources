import { Test, TestingModule } from '@nestjs/testing';

import {
  PartnersServiceProvider,
  PartnersServiceProviderInstance,
  PublicationStatusEnum,
} from '@entities/typeorm';

import { ActionTypes } from '@fc/csmr-config-client';
import { PartnersServiceProviderInstanceVersionService } from '@fc/partners-service-provider-instance-version';
import { OidcClientInterface } from '@fc/service-provider';
import { TypeormService } from '@fc/typeorm';

import { getQueryRunnerMock, getTypeormServiceMock } from '@mocks/typeorm';

import { PartnersInstanceService } from './partners-instance.service';
import { PartnersInstanceVersionFormService } from './partners-instance-version-form.service';
import { PartnerPublicationService } from './partners-publication.service';

describe('PartnersInstanceService', () => {
  let service: PartnersInstanceService;

  const typeormServiceMock = getTypeormServiceMock();
  const queryRunnerMock = getQueryRunnerMock();

  const instance1Mock = {
    id: 'instance-1-id',
    currentVersion: {
      data: {
        name: 'instance name 1',
      },
    },
  } as PartnersServiceProviderInstance;

  const instance2Mock = {
    id: 'instance-2-id',
    currentVersion: {
      data: {
        name: 'instance name 2',
      },
    },
  } as PartnersServiceProviderInstance;

  const serviceProviderMock: PartnersServiceProvider = {
    id: 'service-provider-id',
    name: 'Test Service Provider',
    datapassRequestId: '12345',
    datapassAuthorizationId: '12345678901234',
    datapassEidasLevel: 'eidas_1',
    datapassScopes: ['openid', 'given_name', 'family_name', 'email'],
    platform: null,
    organization: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    instances: [instance1Mock, instance2Mock],
  };

  const versionServiceMock = {
    create: jest.fn(),
  };

  const publicationServiceMock = {
    publish: jest.fn(),
  };

  const formServiceMock = {
    fromFormValues: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersInstanceService,
        TypeormService,
        PartnersServiceProviderInstanceVersionService,
        PartnerPublicationService,
        PartnersInstanceVersionFormService,
      ],
    })
      .overrideProvider(TypeormService)
      .useValue(typeormServiceMock)
      .overrideProvider(PartnersServiceProviderInstanceVersionService)
      .useValue(versionServiceMock)
      .overrideProvider(PartnerPublicationService)
      .useValue(publicationServiceMock)
      .overrideProvider(PartnersInstanceVersionFormService)
      .useValue(formServiceMock)
      .compile();

    service = module.get<PartnersInstanceService>(PartnersInstanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    const updatedBy = 'updated-by-123';
    const versionId = 'version-id-123';
    const dataMock = {
      name: 'instance name 1',
    } as OidcClientInterface;

    beforeEach(() => {
      typeormServiceMock.withQueryRunner.mockImplementationOnce((callback) => {
        callback(queryRunnerMock);
        return versionId;
      });
      versionServiceMock.create.mockResolvedValue({ id: versionId });
    });

    it('should prepare data as from form values', async () => {
      // When
      await service['update'](
        queryRunnerMock,
        dataMock,
        instance1Mock,
        serviceProviderMock.id,
        updatedBy,
      );

      // Then
      expect(formServiceMock.fromFormValues).toHaveBeenCalledExactlyOnceWith(
        instance1Mock.currentVersion.data,
        serviceProviderMock.id,
        instance1Mock.id,
      );
    });

    it('should call version.create with queryRunner', async () => {
      // Given
      formServiceMock.fromFormValues.mockResolvedValue(dataMock);

      // When
      await service['update'](
        queryRunnerMock,
        dataMock,
        instance1Mock,
        serviceProviderMock.id,
        updatedBy,
      );

      // Then
      expect(versionServiceMock.create).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        dataMock,
        instance1Mock.id,
        PublicationStatusEnum.PENDING,
      );
    });

    it('should call publish method with instanceId, versionId, data and action type to update config', async () => {
      // Given
      formServiceMock.fromFormValues.mockResolvedValue(dataMock);
      versionServiceMock.create.mockResolvedValue({ id: versionId });
      const dataWithCreatedInfo = {
        ...dataMock,
        updatedBy,
      };

      // When
      await service['update'](
        queryRunnerMock,
        dataMock,
        instance1Mock,
        serviceProviderMock.id,
        updatedBy,
      );

      // Then
      expect(publicationServiceMock.publish).toHaveBeenCalledWith(
        instance1Mock.id,
        versionId,
        dataWithCreatedInfo,
        ActionTypes.CONFIG_UPDATE,
      );
    });
  });
});

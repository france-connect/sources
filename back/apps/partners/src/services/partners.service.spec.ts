import { Test, TestingModule } from '@nestjs/testing';

import {
  EntityType,
  IPermission,
  RelatedEntitiesHelper,
} from '@fc/access-control';
import { uuid } from '@fc/common';
import { LoggerService } from '@fc/logger-legacy';
import {
  IServiceProviderItem,
  PartnerServiceProviderService,
} from '@fc/partner-service-provider';
import {
  PartnerServiceProviderConfigurationService,
  ServiceProviderConfigurationItemInterface,
  ServiceProviderConfigurationType,
} from '@fc/partner-service-provider-configuration';

import { PartnersRoutes } from '../enums';
import { PartnersService } from './partners.service';

jest.mock('@fc/access-control');

describe('PartnersService', () => {
  let service: PartnersService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
  };

  const partnerServiceProviderServiceMock = {
    getByIds: jest.fn(),
    getById: jest.fn(),
  };

  const partnerServiceProviderConfigurationServiceMock = {
    getByServiceProvider: jest.fn(),
    addForServiceProvider: jest.fn(),
  };

  const permissionsMock = [] as IPermission[];

  const offsetMock = 0;
  const sizeMock = 0;

  const RelatedEntitiesHelperGetMock = jest.spyOn(RelatedEntitiesHelper, 'get');

  const serviceProviderItemMock = Symbol('GetByIdsMockResolvedValue');
  const GetByIdsMockResolvedValue = {
    total: 42,
    items: [serviceProviderItemMock],
  };
  const getByServiceProviderMockResolvedValue = {
    total: 2,
    items: [
      {
        id: 'configuration-uuid-1',
        name: 'configuration name CC',
      },
      {
        id: 'configuration-uuid-2',
        name: 'configuration name DD',
      },
    ],
  };
  const postForServiceProviderMockResolvedValue = {
    id: 'service-configuration-configuration-uuid',
    name: 'configuration name AA',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersService,
        LoggerService,
        PartnerServiceProviderService,
        PartnerServiceProviderConfigurationService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(PartnerServiceProviderService)
      .useValue(partnerServiceProviderServiceMock)
      .overrideProvider(PartnerServiceProviderConfigurationService)
      .useValue(partnerServiceProviderConfigurationServiceMock)
      .compile();

    service = module.get<PartnersService>(PartnersService);

    partnerServiceProviderServiceMock.getByIds.mockResolvedValue(
      GetByIdsMockResolvedValue,
    );

    partnerServiceProviderServiceMock.getById.mockResolvedValue(
      serviceProviderItemMock,
    );

    partnerServiceProviderConfigurationServiceMock.getByServiceProvider.mockResolvedValue(
      getByServiceProviderMockResolvedValue,
    );

    partnerServiceProviderConfigurationServiceMock.addForServiceProvider.mockResolvedValue(
      postForServiceProviderMockResolvedValue,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should setup context for logger', () => {
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('getServiceProviderById', () => {
    it('should call partnersServiceProvider.getById()', async () => {
      // Given
      const idMock: uuid = 'id-mock-value';
      // When
      await service.getServiceProviderById(idMock);
      // Then
      expect(partnerServiceProviderServiceMock.getById).toHaveBeenCalledTimes(
        1,
      );
      expect(partnerServiceProviderServiceMock.getById).toHaveBeenCalledWith(
        idMock,
      );
    });

    it('should return ServiceProvider item', async () => {
      // Given
      const idMock: uuid = 'id-mock-value';
      // When
      const result = await service.getServiceProviderById(idMock);
      // Then
      expect(result).toBe(serviceProviderItemMock);
    });
  });

  describe('getServiceProvidersFromPermissions', () => {
    it('should call RelatedEntitiesHelper.get()', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);
      // When
      await service.getServiceProvidersFromPermissions(
        permissionsMock,
        offsetMock,
        sizeMock,
      );
      // Then
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledTimes(1);

      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledWith(
        permissionsMock,
        {
          entityTypes: [EntityType.SERVICE_PROVIDER],
        },
      );
    });

    it('should return empty FSA if permissions have no matches', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);
      // When
      const result = await service.getServiceProvidersFromPermissions(
        permissionsMock,
        offsetMock,
        sizeMock,
      );
      // Then
      expect(result).toEqual({
        meta: {
          total: 0,
        },
        payload: [],
      });
    });

    it('should call partnerServiceProvider.getByIds()', async () => {
      // Given
      const returnFromHelper = ['foo', 'bar'];
      RelatedEntitiesHelperGetMock.mockReturnValueOnce(returnFromHelper);
      // When
      await service.getServiceProvidersFromPermissions(
        permissionsMock,
        offsetMock,
        sizeMock,
      );
      // Then
      expect(partnerServiceProviderServiceMock.getByIds).toHaveBeenCalledTimes(
        1,
      );
      expect(partnerServiceProviderServiceMock.getByIds).toHaveBeenCalledWith(
        returnFromHelper,
        offsetMock,
        sizeMock,
      );
    });

    it('should call this.mapWithMeta()', async () => {
      // Given
      const returnFromHelper = ['foo', 'bar'];
      RelatedEntitiesHelperGetMock.mockReturnValueOnce(returnFromHelper);
      service['mapWithMeta'] = jest.fn();
      // When
      await service.getServiceProvidersFromPermissions(
        permissionsMock,
        offsetMock,
        sizeMock,
      );
      // Then
      expect(service['mapWithMeta']).toHaveBeenCalledTimes(1);
      expect(service['mapWithMeta']).toHaveBeenCalledWith(
        GetByIdsMockResolvedValue.items,
        permissionsMock,
      );
    });

    it('should return FSA with results from partnerServiceProvider.getByIds()', async () => {
      // Given
      const returnFromHelper = ['foo', 'bar'];
      const returnFromMapWithMeta = [Symbol('returnFromMapWithMeta')];
      RelatedEntitiesHelperGetMock.mockReturnValueOnce(returnFromHelper);
      service['mapWithMeta'] = jest
        .fn()
        .mockReturnValueOnce(returnFromMapWithMeta);
      // When
      const result = await service.getServiceProvidersFromPermissions(
        permissionsMock,
        offsetMock,
        sizeMock,
      );
      // Then
      expect(result).toEqual({
        meta: {
          total: 42,
        },
        payload: returnFromMapWithMeta,
      });
    });
  });

  describe('mapWithMeta', () => {
    // Given
    const item1 = Symbol('item1');

    const listMock = [item1] as unknown as IServiceProviderItem[];

    const permissionsMock = [];
    const buildMetaForServiceProviderMockResult = Symbol(
      'buildMetaForServiceProviderMockResult',
    );

    it('should return data wrapped with meta', () => {
      // Given
      service['buildMetaForServiceProvider'] = jest
        .fn()
        .mockReturnValue(buildMetaForServiceProviderMockResult);
      // When
      const result = service['mapWithMeta'](listMock, permissionsMock);
      // Then
      expect(result).toEqual([
        {
          type: EntityType.SERVICE_PROVIDER,
          meta: buildMetaForServiceProviderMockResult,
          payload: item1,
        },
      ]);
    });
  });

  describe('buildMetaForServiceProvider', () => {
    it('should filter for relevant permissions', () => {
      // Given
      const permissionsMock = [
        {
          entity: 'incorrectEntityType',
          entityId: 'correctEntityId',
          permissionType: 'IncorrectPermissionTypeValue',
        },
        {
          entity: EntityType.SERVICE_PROVIDER,
          entityId: 'correctEntityId',
          permissionType: 'correctPermissionTypeValue',
        },
        {
          entity: EntityType.SERVICE_PROVIDER,
          entityId: 'incorrectEntityId',
          permissionType: 'IncorrectPermissionTypeValue',
        },
      ] as unknown as IPermission[];

      const serviceProviderMock = {
        id: 'correctEntityId',
      } as IServiceProviderItem;

      // When
      const result = service['buildMetaForServiceProvider'](
        serviceProviderMock,
        permissionsMock,
      );
      // Then
      expect(result).toEqual({
        permissions: ['correctPermissionTypeValue'],
        urls: expect.any(Object),
      });
    });

    it('should return routes with correct id', () => {
      // Given
      const permissionsMock = [];
      const serviceProviderMock = {
        id: 'id-mock-value',
      } as IServiceProviderItem;
      // When
      const result = service['buildMetaForServiceProvider'](
        serviceProviderMock,
        permissionsMock,
      );
      // Then
      expect(result).toEqual({
        permissions: expect.any(Array),
        urls: {
          edit: '/service-providers/id-mock-value/edit',
          view: '/service-providers/id-mock-value/view',
        },
      });
    });
  });

  describe('buildFSA', () => {
    it('should return payload with correct id and name', () => {
      // Given
      const serviceProviderConfigurationMock = {
        id: 'correctEntityId',
        name: 'a name',
      } as ServiceProviderConfigurationItemInterface;

      // When
      const result = service['buildFSA'](
        ServiceProviderConfigurationType.ITEM,
        serviceProviderConfigurationMock,
      );

      // Then
      expect(result).toEqual({
        type: 'SERVICE_PROVIDER_CONFIGURATION_ITEM',
        payload: {
          id: 'correctEntityId',
          name: 'a name',
        },
      });
    });
  });

  describe('buildUrls', () => {
    it('should return meta with correct view and delete', () => {
      // Given
      const id = 'correctEntityId';
      const buildUrlsMock = {
        view: `${PartnersRoutes.SERVICE_PROVIDER_CONFIGURATION_LIST}/${id}`,
        delete: `${PartnersRoutes.SERVICE_PROVIDER_CONFIGURATION_DELETE.replace(
          ':id',
          'correctEntityId',
        )}`,
      };

      // When
      const result = service['buildUrls']('correctEntityId');

      // Then
      expect(result).toEqual(buildUrlsMock);
    });
  });

  describe('getConfigurationsFromServiceProvider', () => {
    it('should call partnerServiceProviderConfiguration.getByServiceProvider with the service provider id', async () => {
      // Given
      const serviceProviderIdMock: uuid = 'one-sp-id-uuid';

      // When
      await service.getConfigurationsFromServiceProvider(serviceProviderIdMock);

      // Then
      expect(
        partnerServiceProviderConfigurationServiceMock.getByServiceProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        partnerServiceProviderConfigurationServiceMock.getByServiceProvider,
      ).toHaveBeenCalledWith(serviceProviderIdMock);
    });

    it('should return empty FSA if there no configurations', async () => {
      // Given
      const serviceProviderIdMock: uuid = '';
      const getZeroConfigurationDataMockResolveValue = {
        total: 0,
        items: [],
      };

      // When
      partnerServiceProviderConfigurationServiceMock.getByServiceProvider.mockResolvedValue(
        getZeroConfigurationDataMockResolveValue,
      );
      const result = await service.getConfigurationsFromServiceProvider(
        serviceProviderIdMock,
      );

      // Then
      expect(result).toEqual({
        type: 'SERVICE_PROVIDER_CONFIGURATION_LIST',
        meta: {
          total: 0,
        },
        payload: [],
      });
    });

    it('should call this.mapConfigWithMeta()', async () => {
      // Given
      const serviceProviderIdMock: uuid = 'one-sp-id-uuid';
      service['mapConfigWithMeta'] = jest.fn();

      // When
      await service.getConfigurationsFromServiceProvider(serviceProviderIdMock);

      // Then
      expect(service['mapConfigWithMeta']).toHaveBeenCalledTimes(1);
      expect(service['mapConfigWithMeta']).toHaveBeenCalledWith(
        getByServiceProviderMockResolvedValue.items,
      );
    });

    it('should return FSA with configurations', async () => {
      // Given
      const serviceProviderIdMock: uuid = 'one-sp-uuid';
      const expected = {
        type: 'SERVICE_PROVIDER_CONFIGURATION_LIST',
        meta: {
          total: 2,
        },
        payload: [
          {
            payload: {
              id: 'configuration-uuid-1',
              name: 'configuration name CC',
            },
            type: 'SERVICE_PROVIDER_CONFIGURATION_ITEM',
          },
          {
            payload: {
              id: 'configuration-uuid-2',
              name: 'configuration name DD',
            },
            type: 'SERVICE_PROVIDER_CONFIGURATION_ITEM',
          },
        ],
      };

      // When
      const result = await service.getConfigurationsFromServiceProvider(
        serviceProviderIdMock,
      );

      // Then
      expect(result).toEqual(expected);
    });
  });

  describe('saveConfigurationForServiceProvider', () => {
    // Given
    const serviceProviderIdMock: uuid = 'one-sp-id-uuid';
    const serviceProviderConfigurationIdMock: uuid =
      'service-configuration-configuration-uuid';

    it('should call partnerServiceProviderConfiguration.addForServiceProvider()', async () => {
      // When
      await service.saveConfigurationForServiceProvider(serviceProviderIdMock);

      // Then
      expect(
        partnerServiceProviderConfigurationServiceMock.addForServiceProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        partnerServiceProviderConfigurationServiceMock.addForServiceProvider,
      ).toHaveBeenCalledWith(serviceProviderIdMock);
    });

    it('should call this.buildUrls() with service provider configuration id', async () => {
      // Given
      service['buildUrls'] = jest.fn();

      // When
      await service.saveConfigurationForServiceProvider(serviceProviderIdMock);

      // Then
      expect(service['buildUrls']).toHaveBeenCalledTimes(1);
      expect(service['buildUrls']).toHaveBeenCalledWith(
        serviceProviderConfigurationIdMock,
      );
    });

    it('should return configuration item', async () => {
      // Given
      const expected = {
        type: 'SERVICE_PROVIDER_CONFIGURATION_ITEM',
        meta: {
          urls: {
            delete: `/service-provider-configurations/${serviceProviderConfigurationIdMock}`,
            view: `/service-provider-configurations/${serviceProviderConfigurationIdMock}`,
          },
          total: 2,
        },
        payload: {
          id: serviceProviderConfigurationIdMock,
          name: 'configuration name AA',
        },
      };

      // When
      const result = await service.saveConfigurationForServiceProvider(
        serviceProviderIdMock,
      );

      // Then
      expect(result).toEqual(expected);
    });
  });
});

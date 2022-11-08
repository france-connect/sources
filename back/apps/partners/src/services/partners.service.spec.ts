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

  const permissionsMock = [] as IPermission[];

  const offsetMock = 0;
  const sizeMock = 0;

  const RelatedEntitiesHelperGetMock = jest.spyOn(RelatedEntitiesHelper, 'get');

  const serviceProviderItemMock = Symbol('GetByIdsMockResolvedValue');
  const GetByIdsMockResolvedValue = {
    total: 42,
    items: [serviceProviderItemMock],
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersService,
        LoggerService,
        PartnerServiceProviderService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(PartnerServiceProviderService)
      .useValue(partnerServiceProviderServiceMock)
      .compile();

    service = module.get<PartnersService>(PartnersService);

    partnerServiceProviderServiceMock.getByIds.mockResolvedValue(
      GetByIdsMockResolvedValue,
    );

    partnerServiceProviderServiceMock.getById.mockResolvedValue(
      serviceProviderItemMock,
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
});

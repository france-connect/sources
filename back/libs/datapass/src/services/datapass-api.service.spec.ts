import * as ClassTransformer from 'class-transformer';
import * as ClassValidator from 'class-validator';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import * as FcCommon from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { DatapassApiResponseDto } from '../dto';
import {
  DatapassApiRoutes,
  DatapassAuthorizationState,
  DatapassEidasLevels,
} from '../enums';
import {
  DatapassApiHttpException,
  DatapassApiResponseValidationException,
  DatapassPaginationLimitExceededException,
} from '../exceptions';
import {
  DatapassApiResponseInterface,
  DatapassFilterableItemInterface,
} from '../interfaces';
import { DatapassApiService } from './datapass-api.service';

jest.mock('class-transformer', () => ({
  ...jest.requireActual('class-transformer'),
  plainToInstance: jest.fn(),
}));

jest.mock('class-validator', () => ({
  ...jest.requireActual('class-validator'),
  validateOrReject: jest.fn(),
}));

jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'),
  lastValueFrom: jest.fn(),
}));

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  getAllPropertiesErrors: jest.fn(),
  nowInSeconds: jest.fn(),
}));

describe('DatapassApiService', () => {
  let service: DatapassApiService;

  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();
  const httpServiceMock = {
    get: jest.fn(),
    post: jest.fn(),
  };

  const lastValueFromMock = jest.mocked(lastValueFrom);
  const plainToInstanceMock = jest.mocked(ClassTransformer.plainToInstance);
  const validateOrRejectMock = jest.mocked(ClassValidator.validateOrReject);
  const getAllPropertiesErrorsMock = jest.mocked(
    FcCommon.getAllPropertiesErrors,
  );

  const apiUrl = 'https://datapass.api.gouv.fr';
  const clientId = 'client-id';
  const clientSecret = 'client-secret';
  const accessTokenMock = 'access-token-mock';

  const datapassConfigMock = {
    apiUrl,
    clientId,
    clientSecret,
  };

  const validDtoMock: DatapassApiResponseInterface = {
    id: 1,
    public_id: 'public-id-1',
    state: 'validated',
    form_uid: 'form-uid-1',
    last_validated_at: '2024-01-15T10:00:00Z',
    data: {
      intitule: 'Test Service',
      scopes: '["openid","profile"]',
      france_connect_eidas: DatapassEidasLevels.EIDAS_1,
      contact_technique_email: 'tech@example.com',
      contact_technique_given_name: 'Jean',
      contact_technique_family_name: 'Dupont',
      contact_technique_phone_number: '+33123456789',
    },
    habilitations: [
      {
        id: 10,
        state: DatapassAuthorizationState.ACTIVE,
        authorization_request_class: 'AuthorizationRequest::FranceConnect',
        revoked: false,
      },
    ],
    organisation: {
      id: 100,
      siret: '12345678901234',
      insee_payload: {
        etablissement: {
          uniteLegale: {
            denominationUniteLegale: 'Entreprise Test',
          },
        },
      },
    },
    applicant: {
      email: 'applicant@example.com',
      given_name: 'Alice',
      family_name: 'Martin',
    },
  };

  const validDtoEidas2Mock: DatapassApiResponseInterface = {
    ...validDtoMock,
    id: 2,
    data: {
      ...validDtoMock.data,
      france_connect_eidas: DatapassEidasLevels.EIDAS_2,
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatapassApiService,
        ConfigService,
        LoggerService,
        HttpService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .compile();

    service = module.get<DatapassApiService>(DatapassApiService);

    configMock.get.mockReturnValue(datapassConfigMock);
    lastValueFromMock.mockResolvedValue({
      data: { access_token: accessTokenMock },
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHabilitations', () => {
    const rawItemMock = { id: 1 };

    beforeEach(() => {
      service['getAccessToken'] = jest.fn().mockResolvedValue(accessTokenMock);
      service['fetchAllDemandes'] = jest.fn().mockResolvedValue([rawItemMock]);
      service['validateItems'] = jest.fn().mockResolvedValue([]);
      service['matchesFilters'] = jest.fn().mockReturnValue(true);
    });

    it('should call getAccessToken', async () => {
      // When
      await service.getHabilitations([DatapassEidasLevels.EIDAS_1]);

      // Then
      expect(service['getAccessToken']).toHaveBeenCalledExactlyOnceWith();
    });

    it('should call fetchAllDemandes with the access token', async () => {
      // When
      await service.getHabilitations([DatapassEidasLevels.EIDAS_1]);

      // Then
      expect(service['fetchAllDemandes']).toHaveBeenCalledExactlyOnceWith(
        accessTokenMock,
      );
    });

    it('should call matchesFilters for each raw item with provided eidas levels', async () => {
      // Given
      const eidasLevelsMock = [DatapassEidasLevels.EIDAS_1];

      // When
      await service.getHabilitations(eidasLevelsMock);

      // Then
      expect(service['matchesFilters']).toHaveBeenCalledExactlyOnceWith(
        rawItemMock,
        eidasLevelsMock,
        undefined,
      );
    });

    it('should call matchesFilters with the since parameter when provided', async () => {
      // Given
      const eidasLevelsMock = [DatapassEidasLevels.EIDAS_1];
      const sinceMock = new Date('2024-01-01T00:00:00Z');

      // When
      await service.getHabilitations(eidasLevelsMock, sinceMock);

      // Then
      expect(service['matchesFilters']).toHaveBeenCalledExactlyOnceWith(
        rawItemMock,
        eidasLevelsMock,
        sinceMock,
      );
    });

    it('should call validateItems only with items that pass matchesFilters', async () => {
      // When
      await service.getHabilitations([DatapassEidasLevels.EIDAS_1]);

      // Then
      expect(service['validateItems']).toHaveBeenCalledExactlyOnceWith([
        rawItemMock,
      ]);
    });

    it('should not pass items to validateItems that do not pass matchesFilters', async () => {
      // Given
      service['fetchAllDemandes'] = jest
        .fn()
        .mockResolvedValue([rawItemMock, { id: 2 }]);
      service['matchesFilters'] = jest
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      // When
      await service.getHabilitations([DatapassEidasLevels.EIDAS_1]);

      // Then
      expect(service['validateItems']).toHaveBeenCalledExactlyOnceWith([
        rawItemMock,
      ]);
    });

    it('should return the result of validateItems', async () => {
      // Given
      const payloadMock = { event: 'approve' } as any;
      service['validateItems'] = jest.fn().mockResolvedValue([payloadMock]);

      // When
      const result = await service.getHabilitations([
        DatapassEidasLevels.EIDAS_1,
      ]);

      // Then
      expect(result).toEqual([payloadMock]);
    });
  });

  describe('fetchAllDemandes', () => {
    it('should get Datapass config from ConfigService', async () => {
      // Given
      service['fetchValidatedSpRequests'] = jest.fn().mockResolvedValue([]);

      // When
      await service['fetchAllDemandes'](accessTokenMock);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('Datapass');
    });

    it('should call fetchValidatedSpRequests with the demandes url, access token and offset 0 on first page', async () => {
      // Given
      service['fetchValidatedSpRequests'] = jest.fn().mockResolvedValue([]);

      // When
      await service['fetchAllDemandes'](accessTokenMock);

      // Then
      expect(
        service['fetchValidatedSpRequests'],
      ).toHaveBeenCalledExactlyOnceWith(
        `${apiUrl}${DatapassApiRoutes.DEMANDES}`,
        accessTokenMock,
        0,
      );
    });

    it('should stop after one call when the page is smaller than PAGE_SIZE', async () => {
      // Given
      service['fetchValidatedSpRequests'] = jest
        .fn()
        .mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);

      // When
      const result = await service['fetchAllDemandes'](accessTokenMock);

      // Then
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should request a second page with incremented offset when the first page is full', async () => {
      // Given
      const fullPage = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
      const lastPage = [{ id: 1000 }];
      service['fetchValidatedSpRequests'] = jest
        .fn()
        .mockResolvedValueOnce(fullPage)
        .mockResolvedValueOnce(lastPage);

      // When
      const result = await service['fetchAllDemandes'](accessTokenMock);

      // Then
      expect(service['fetchValidatedSpRequests']).toHaveBeenCalledTimes(2);
      expect(service['fetchValidatedSpRequests']).toHaveBeenNthCalledWith(
        2,
        `${apiUrl}${DatapassApiRoutes.DEMANDES}`,
        accessTokenMock,
        1000,
      );
      expect(result).toHaveLength(1001);
    });

    it('should call assertPaginationWithinLimit before each iteration', async () => {
      // Given
      service['assertPaginationWithinLimit'] = jest.fn();
      service['fetchValidatedSpRequests'] = jest.fn().mockResolvedValue([]);

      // When
      await service['fetchAllDemandes'](accessTokenMock);

      // Then
      expect(
        service['assertPaginationWithinLimit'],
      ).toHaveBeenCalledExactlyOnceWith(0);
    });

    it('should propagate the error thrown by assertPaginationWithinLimit', async () => {
      // Given
      const fullPage = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
      service['fetchValidatedSpRequests'] = jest
        .fn()
        .mockResolvedValue(fullPage);
      const guardErrorMock = new Error('limit reached');
      service['assertPaginationWithinLimit'] = jest
        .fn()
        .mockImplementationOnce(() => undefined)
        .mockImplementationOnce(() => {
          throw guardErrorMock;
        });

      // When / Then
      await expect(service['fetchAllDemandes'](accessTokenMock)).rejects.toBe(
        guardErrorMock,
      );
    });

    it('should propagate the error thrown by fetchValidatedSpRequests', async () => {
      // Given
      const httpExceptionMock = new DatapassApiHttpException(
        new Error('Network error'),
      );
      service['fetchValidatedSpRequests'] = jest
        .fn()
        .mockRejectedValueOnce(httpExceptionMock);

      // When / Then
      await expect(service['fetchAllDemandes'](accessTokenMock)).rejects.toBe(
        httpExceptionMock,
      );
    });
  });

  describe('fetchValidatedSpRequests', () => {
    const urlMock = `${apiUrl}${DatapassApiRoutes.DEMANDES}`;
    const offsetMock = 0;

    it('should call httpService.get with state, definition_id, limit and provided offset', async () => {
      // Given
      lastValueFromMock.mockResolvedValueOnce({ data: [] });

      // When
      await service['fetchValidatedSpRequests'](
        urlMock,
        accessTokenMock,
        offsetMock,
      );

      // Then
      expect(httpServiceMock.get).toHaveBeenCalledExactlyOnceWith(urlMock, {
        params: {
          state: 'validated',
          definition_id: 'france_connect',
          limit: 1000,
          offset: offsetMock,
        },
        headers: { Authorization: `Bearer ${accessTokenMock}` },
      });
    });

    it('should return the data field from the HTTP response', async () => {
      // Given
      const pageMock = [{ id: 1 }, { id: 2 }];
      lastValueFromMock.mockResolvedValueOnce({ data: pageMock });

      // When
      const result = await service['fetchValidatedSpRequests'](
        urlMock,
        accessTokenMock,
        offsetMock,
      );

      // Then
      expect(result).toBe(pageMock);
    });

    it('should throw DatapassApiHttpException when HTTP request fails', async () => {
      // Given
      const httpErrorMock = new Error('Network error');
      lastValueFromMock.mockRejectedValueOnce(httpErrorMock);

      // When / Then
      await expect(
        service['fetchValidatedSpRequests'](
          urlMock,
          accessTokenMock,
          offsetMock,
        ),
      ).rejects.toThrow(DatapassApiHttpException);
    });
  });

  describe('assertPaginationWithinLimit', () => {
    it('should not throw when iterations is 0', () => {
      // When / Then
      expect(() => service['assertPaginationWithinLimit'](0)).not.toThrow();
    });

    it('should not throw when iterations is just below the limit', () => {
      // When / Then
      expect(() => service['assertPaginationWithinLimit'](14)).not.toThrow();
    });

    it('should throw DatapassPaginationLimitExceededException when iterations is equal to the limit', () => {
      // When / Then
      expect(() => service['assertPaginationWithinLimit'](15)).toThrow(
        DatapassPaginationLimitExceededException,
      );
    });

    it('should throw DatapassPaginationLimitExceededException when iterations is above the limit', () => {
      // When / Then
      expect(() => service['assertPaginationWithinLimit'](42)).toThrow(
        DatapassPaginationLimitExceededException,
      );
    });
  });

  describe('extractItemId', () => {
    it('should return the id when item is an object with a numeric id', () => {
      // When
      const result = service['extractItemId']({ id: 123 });

      // Then
      expect(result).toBe(123);
    });

    it('should return undefined when item has no id property', () => {
      // When
      const result = service['extractItemId']({});

      // Then
      expect(result).toBeUndefined();
    });

    it('should return undefined when item is null', () => {
      // When
      const result = service['extractItemId'](null);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return undefined when item is undefined', () => {
      // When
      const result = service['extractItemId'](undefined);

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('getHabilitationById', () => {
    const requestIdMock = 42;
    const payloadMock = { event: 'approve' } as any;

    beforeEach(() => {
      service['getAccessToken'] = jest.fn().mockResolvedValue(accessTokenMock);
      service['validateItem'] = jest.fn().mockResolvedValue(validDtoMock);
      service['toPayload'] = jest.fn().mockReturnValue(payloadMock);
    });

    it('should call getAccessToken', async () => {
      // When
      await service.getHabilitationById(requestIdMock);

      // Then
      expect(service['getAccessToken']).toHaveBeenCalledExactlyOnceWith();
    });

    it('should get Datapass config from ConfigService', async () => {
      // When
      await service.getHabilitationById(requestIdMock);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('Datapass');
    });

    it('should call httpService.get with correct url and Authorization header', async () => {
      // When
      await service.getHabilitationById(requestIdMock);

      // Then
      expect(httpServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        `${apiUrl}${DatapassApiRoutes.DEMANDE.replace(':id', String(requestIdMock))}`,
        {
          headers: { Authorization: `Bearer ${accessTokenMock}` },
        },
      );
    });

    it('should call validateItem with raw data from response', async () => {
      // Given
      const rawDataMock = { id: requestIdMock };
      lastValueFromMock.mockResolvedValueOnce({ data: rawDataMock });

      // When
      await service.getHabilitationById(requestIdMock);

      // Then
      expect(service['validateItem']).toHaveBeenCalledExactlyOnceWith(
        rawDataMock,
      );
    });

    it('should call toPayload with the validated habilitation', async () => {
      // When
      await service.getHabilitationById(requestIdMock);

      // Then
      expect(service['toPayload']).toHaveBeenCalledExactlyOnceWith(
        validDtoMock,
      );
    });

    it('should return the result of toPayload', async () => {
      // When
      const result = await service.getHabilitationById(requestIdMock);

      // Then
      expect(result).toBe(payloadMock);
    });

    it('should throw DatapassApiHttpException when HTTP request fails', async () => {
      // Given
      const httpErrorMock = new Error('Network error');
      lastValueFromMock.mockRejectedValueOnce(httpErrorMock);

      // When / Then
      await expect(service.getHabilitationById(requestIdMock)).rejects.toThrow(
        DatapassApiHttpException,
      );
    });

    it('should log a warning with request id when HTTP request fails', async () => {
      // Given
      const httpErrorMock = new Error('Network error');
      lastValueFromMock.mockRejectedValueOnce(httpErrorMock);

      // When
      await service.getHabilitationById(requestIdMock).catch(() => {});

      // Then
      expect(loggerMock.warning).toHaveBeenCalledExactlyOnceWith({
        message: 'Datapass API HTTP request failed',
        datapassRequestId: requestIdMock,
      });
    });

    it('should throw DatapassApiResponseValidationException when validateItem returns null', async () => {
      // Given
      service['validateItem'] = jest.fn().mockResolvedValue(null);

      // When / Then
      await expect(service.getHabilitationById(requestIdMock)).rejects.toThrow(
        DatapassApiResponseValidationException,
      );
    });
  });

  describe('getAccessToken', () => {
    beforeEach(() => {
      lastValueFromMock.mockResolvedValue({
        data: { access_token: accessTokenMock },
      });
    });

    it('should get Datapass config from ConfigService', async () => {
      // When
      await service['getAccessToken']();

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('Datapass');
    });

    it('should call httpService.post with token endpoint and form-encoded credentials', async () => {
      // Given
      const expectedParams = new URLSearchParams();
      expectedParams.append('grant_type', 'client_credentials');
      expectedParams.append('client_id', clientId);
      expectedParams.append('client_secret', clientSecret);

      // When
      await service['getAccessToken']();

      // Then
      expect(httpServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        `${apiUrl}${DatapassApiRoutes.TOKEN}`,
        expectedParams.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
    });

    it('should call lastValueFrom to resolve the token observable', async () => {
      // When
      await service['getAccessToken']();

      // Then
      expect(lastValueFromMock).toHaveBeenCalledTimes(1);
    });

    it('should return the access_token from the response', async () => {
      // When
      const result = await service['getAccessToken']();

      // Then
      expect(result).toBe(accessTokenMock);
    });

    it('should log a warning when the token request fails', async () => {
      // Given
      const httpErrorMock = new Error('OAuth token request failed');
      lastValueFromMock.mockRejectedValueOnce(httpErrorMock);

      // When
      await service['getAccessToken']().catch(() => {});

      // Then
      expect(loggerMock.warning).toHaveBeenCalledExactlyOnceWith({
        message: 'Datapass OAuth2 token request failed',
        error: httpErrorMock,
      });
    });

    it('should throw DatapassApiHttpException when the token request fails', async () => {
      // Given
      const httpErrorMock = new Error('OAuth token request failed');
      lastValueFromMock.mockRejectedValueOnce(httpErrorMock);

      // When / Then
      await expect(service['getAccessToken']()).rejects.toThrow(
        DatapassApiHttpException,
      );
    });
  });

  describe('validateItems', () => {
    const payloadMock = { event: 'approve' } as any;

    beforeEach(() => {
      service['validateItem'] = jest.fn().mockResolvedValue(validDtoMock);
      service['toPayload'] = jest.fn().mockReturnValue(payloadMock);
    });

    it('should call validateItem for each item in rawData', async () => {
      // Given
      const rawDataMock = [{ id: 1 }, { id: 2 }];

      // When
      await service['validateItems'](rawDataMock);

      // Then
      expect(service['validateItem']).toHaveBeenCalledTimes(2);
    });

    it('should call toPayload for each validated item', async () => {
      // Given
      const rawDataMock = [{ id: 1 }, { id: 2 }];

      // When
      await service['validateItems'](rawDataMock);

      // Then
      expect(service['toPayload']).toHaveBeenCalledTimes(2);
    });

    it('should return payloads for all items that pass validation', async () => {
      // Given
      const rawDataMock = [{ id: 1 }, { id: 2 }];

      // When
      const result = await service['validateItems'](rawDataMock);

      // Then
      expect(result).toHaveLength(2);
    });

    it('should exclude items that return null from validateItem', async () => {
      // Given
      const rawDataMock = [{ id: 1 }, { id: 2 }];
      service['validateItem'] = jest
        .fn()
        .mockResolvedValueOnce(validDtoMock)
        .mockResolvedValueOnce(null);

      // When
      const result = await service['validateItems'](rawDataMock);

      // Then
      expect(result).toHaveLength(1);
    });

    it('should not call toPayload for items that fail validation', async () => {
      // Given
      const rawDataMock = [{ id: 1 }, { id: 2 }];
      service['validateItem'] = jest
        .fn()
        .mockResolvedValueOnce(validDtoMock)
        .mockResolvedValueOnce(null);

      // When
      await service['validateItems'](rawDataMock);

      // Then
      expect(service['toPayload']).toHaveBeenCalledTimes(1);
    });

    it('should return the result of toPayload', async () => {
      // Given
      const rawDataMock = [{ id: 1 }];

      // When
      const result = await service['validateItems'](rawDataMock);

      // Then
      expect(result[0]).toBe(payloadMock);
    });

    it('should return an empty array when rawData is empty', async () => {
      // Given
      const rawDataMock: unknown[] = [];

      // When
      const result = await service['validateItems'](rawDataMock);

      // Then
      expect(result).toEqual([]);
    });

    it('should skip items whose toPayload throws and continue with the next ones', async () => {
      // Given
      const rawDataMock = [{ id: 1 }, { id: 2 }];
      service['toPayload'] = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new Error('mapping failed');
        })
        .mockReturnValueOnce(payloadMock);

      // When
      const result = await service['validateItems'](rawDataMock);

      // Then
      expect(result).toEqual([payloadMock]);
    });

    it('should log a warning with the item id and error message when toPayload throws', async () => {
      // Given
      const rawDataMock = [{ id: 42 }];
      service['toPayload'] = jest.fn().mockImplementationOnce(() => {
        throw new Error('mapping failed');
      });

      // When
      await service['validateItems'](rawDataMock);

      // Then
      expect(loggerMock.warning).toHaveBeenCalledExactlyOnceWith({
        message: 'Datapass API payload mapping failed, skipping entry',
        datapassRequestId: 42,
        error: 'mapping failed',
      });
    });
  });

  describe('toPayload', () => {
    const nowInSecondsMock = jest.mocked(FcCommon.nowInSeconds);
    const firedAtMock = 1700000000;

    beforeEach(() => {
      nowInSecondsMock.mockReturnValue(firedAtMock);
    });

    it('should set event to DatapassEvents.APPROVE', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.event).toBe('approve');
    });

    it('should set fired_at to nowInSeconds()', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.fired_at).toBe(firedAtMock);
    });

    it('should set model_type to AuthorizationRequest', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.model_type).toBe('AuthorizationRequest');
    });

    it('should set last_validated_at from apiResponse', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.last_validated_at).toBe(validDtoMock.last_validated_at);
    });

    it('should set data.id from apiResponse.id', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.id).toBe(validDtoMock.id);
    });

    it('should set data.public_id from apiResponse.public_id', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.public_id).toBe(validDtoMock.public_id);
    });

    it('should set data.state from apiResponse.state', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.state).toBe(validDtoMock.state);
    });

    it('should set data.form_uid from apiResponse.form_uid', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.form_uid).toBe(validDtoMock.form_uid);
    });

    it('should set data.organization.id from apiResponse.organisation.id', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.organization.id).toBe(validDtoMock.organisation.id);
    });

    it('should set data.organization.name from denominationUniteLegale', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.organization.name).toBe(
        validDtoMock.organisation.insee_payload.etablissement.uniteLegale
          .denominationUniteLegale,
      );
    });

    it('should set data.organization.name to default when denominationUniteLegale is null', () => {
      // Given
      const dtoWithNullNameMock: DatapassApiResponseInterface = {
        ...validDtoMock,
        organisation: {
          ...validDtoMock.organisation,
          insee_payload: {
            etablissement: {
              uniteLegale: {
                denominationUniteLegale: null,
              },
            },
          },
        },
      };

      // When
      const result = service['toPayload'](dtoWithNullNameMock);

      // Then
      expect(result.data.organization.name).toBe('Organisation inconnue');
    });

    it('should set data.organization.siret from apiResponse.organisation.siret', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.organization.siret).toBe(
        validDtoMock.organisation.siret,
      );
    });

    it('should set data.applicant.email from apiResponse.applicant.email', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.applicant.email).toBe(validDtoMock.applicant.email);
    });

    it('should set data.applicant.given_name from apiResponse.applicant.given_name', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.applicant.given_name).toBe(
        validDtoMock.applicant.given_name,
      );
    });

    it('should set data.applicant.family_name from apiResponse.applicant.family_name', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.applicant.family_name).toBe(
        validDtoMock.applicant.family_name,
      );
    });

    it('should parse scopes from JSON string', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.data.scopes).toEqual(['openid', 'profile']);
    });

    it('should filter out legacy scopes', () => {
      // Given
      const dtoWithLegacyScopesMock: DatapassApiResponseInterface = {
        ...validDtoMock,
        data: {
          ...validDtoMock.data,
          scopes: '["openid","profile","phone","address"]',
        },
      };

      // When
      const result = service['toPayload'](dtoWithLegacyScopesMock);

      // Then
      expect(result.data.data.scopes).toEqual(['openid', 'profile']);
    });

    it('should set data.data.intitule from apiResponse.data.intitule', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.data.intitule).toBe(validDtoMock.data.intitule);
    });

    it('should set data.data.france_connect_eidas from apiResponse.data.france_connect_eidas', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.data.france_connect_eidas).toBe(
        validDtoMock.data.france_connect_eidas,
      );
    });

    it('should map habilitations to authorizations with id as string', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.authorizations[0].id).toBe(
        String(validDtoMock.habilitations[0].id),
      );
    });

    it('should set authorization state from habilitation state', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.authorizations[0].state).toBe(
        validDtoMock.habilitations[0].state,
      );
    });

    it('should set authorization authorization_request_class from habilitation', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.authorizations[0].authorization_request_class).toBe(
        validDtoMock.habilitations[0].authorization_request_class,
      );
    });

    it('should set authorization revoked from habilitation revoked', () => {
      // When
      const result = service['toPayload'](validDtoMock);

      // Then
      expect(result.data.authorizations[0].revoked).toBe(
        validDtoMock.habilitations[0].revoked,
      );
    });
  });

  // ============================================================
  // validateItem (private)
  // ============================================================
  describe('validateItem', () => {
    beforeEach(() => {
      plainToInstanceMock.mockReturnValue(validDtoMock as any);
      validateOrRejectMock.mockResolvedValue(undefined);
      getAllPropertiesErrorsMock.mockReturnValue([]);
    });

    it('should call plainToInstance with DatapassApiResponseDto and enableImplicitConversion', async () => {
      // Given
      const itemMock = { id: 1 };

      // When
      await service['validateItem'](itemMock);

      // Then
      expect(plainToInstanceMock).toHaveBeenCalledExactlyOnceWith(
        DatapassApiResponseDto,
        itemMock,
        { enableImplicitConversion: true },
      );
    });

    it('should call validateOrReject with the DTO and validation options', async () => {
      // Given
      const itemMock = { id: 1 };

      // When
      await service['validateItem'](itemMock);

      // Then
      expect(validateOrRejectMock).toHaveBeenCalledExactlyOnceWith(
        validDtoMock,
        {
          whitelist: true,
          forbidNonWhitelisted: false,
          skipMissingProperties: false,
        },
      );
    });

    it('should return the DTO as DatapassApiResponseInterface when validation passes', async () => {
      // Given
      const itemMock = { id: 1 };

      // When
      const result = await service['validateItem'](itemMock);

      // Then
      expect(result).toBe(validDtoMock);
    });

    it('should call getAllPropertiesErrors with the validation errors when validation fails', async () => {
      // Given
      const itemMock = { id: 42 };
      const validationErrorsMock = [new ClassValidator.ValidationError()];
      validateOrRejectMock.mockRejectedValueOnce(validationErrorsMock);

      // When
      await service['validateItem'](itemMock);

      // Then
      expect(getAllPropertiesErrorsMock).toHaveBeenCalledExactlyOnceWith(
        validationErrorsMock,
      );
    });

    it('should log a warning with datapassRequestId and formatted validation errors when validation fails', async () => {
      // Given
      const itemMock = { id: 42 };
      const validationErrorsMock = [new ClassValidator.ValidationError()];
      validateOrRejectMock.mockRejectedValueOnce(validationErrorsMock);
      getAllPropertiesErrorsMock.mockReturnValueOnce(['someField: isNotEmpty']);

      // When
      await service['validateItem'](itemMock);

      // Then
      expect(loggerMock.warning).toHaveBeenCalledExactlyOnceWith({
        message: 'Datapass API response validation failed, skipping entry',
        datapassRequestId: 42,
        validationErrors: 'someField: isNotEmpty',
      });
    });

    it('should log a warning with undefined datapassRequestId when item has no id', async () => {
      // Given
      const itemMock = {};
      const validationErrorsMock = [new ClassValidator.ValidationError()];
      validateOrRejectMock.mockRejectedValueOnce(validationErrorsMock);

      // When
      await service['validateItem'](itemMock);

      // Then
      expect(loggerMock.warning).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ datapassRequestId: undefined }),
      );
    });

    it('should return null when validation fails', async () => {
      // Given
      const itemMock = { id: 1 };
      const validationErrorsMock = [new ClassValidator.ValidationError()];
      validateOrRejectMock.mockRejectedValueOnce(validationErrorsMock);

      // When
      const result = await service['validateItem'](itemMock);

      // Then
      expect(result).toBeNull();
    });
  });

  describe('matchesFilters', () => {
    const eidasLevelsMock = [DatapassEidasLevels.EIDAS_1];

    it('should return true when isEidasLevelAllowed and isValidatedAfterDate are both true', () => {
      // Given
      service['isEidasLevelAllowed'] = jest.fn().mockReturnValue(true);
      service['isValidatedAfterDate'] = jest.fn().mockReturnValue(true);

      // When
      const result = service['matchesFilters'](validDtoMock, eidasLevelsMock);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when isEidasLevelAllowed is false', () => {
      // Given
      service['isEidasLevelAllowed'] = jest.fn().mockReturnValue(false);
      service['isValidatedAfterDate'] = jest.fn().mockReturnValue(true);

      // When
      const result = service['matchesFilters'](validDtoMock, eidasLevelsMock);

      // Then
      expect(result).toBe(false);
    });

    it('should return false when isValidatedAfterDate is false', () => {
      // Given
      service['isEidasLevelAllowed'] = jest.fn().mockReturnValue(true);
      service['isValidatedAfterDate'] = jest.fn().mockReturnValue(false);

      // When
      const result = service['matchesFilters'](validDtoMock, eidasLevelsMock);

      // Then
      expect(result).toBe(false);
    });

    it('should call isEidasLevelAllowed with the item and provided eidas levels', () => {
      // Given
      service['isEidasLevelAllowed'] = jest.fn().mockReturnValue(true);
      service['isValidatedAfterDate'] = jest.fn().mockReturnValue(true);

      // When
      service['matchesFilters'](validDtoMock, eidasLevelsMock);

      // Then
      expect(service['isEidasLevelAllowed']).toHaveBeenCalledExactlyOnceWith(
        validDtoMock,
        eidasLevelsMock,
      );
    });

    it('should call isValidatedAfterDate with the item and since parameter', () => {
      // Given
      const sinceMock = new Date('2024-01-01T00:00:00Z');
      service['isEidasLevelAllowed'] = jest.fn().mockReturnValue(true);
      service['isValidatedAfterDate'] = jest.fn().mockReturnValue(true);

      // When
      service['matchesFilters'](validDtoMock, eidasLevelsMock, sinceMock);

      // Then
      expect(service['isValidatedAfterDate']).toHaveBeenCalledExactlyOnceWith(
        validDtoMock,
        sinceMock,
      );
    });

    it('should call isValidatedAfterDate with undefined since when not provided', () => {
      // Given
      service['isEidasLevelAllowed'] = jest.fn().mockReturnValue(true);
      service['isValidatedAfterDate'] = jest.fn().mockReturnValue(true);

      // When
      service['matchesFilters'](validDtoMock, eidasLevelsMock);

      // Then
      expect(service['isValidatedAfterDate']).toHaveBeenCalledExactlyOnceWith(
        validDtoMock,
        undefined,
      );
    });
  });

  describe('isEidasLevelAllowed', () => {
    it('should return true when france_connect_eidas is in the allowed levels', () => {
      // When
      const result = service['isEidasLevelAllowed'](validDtoMock, [
        DatapassEidasLevels.EIDAS_1,
      ]);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when france_connect_eidas is not in the allowed levels', () => {
      // When
      const result = service['isEidasLevelAllowed'](validDtoEidas2Mock, [
        DatapassEidasLevels.EIDAS_1,
      ]);

      // Then
      expect(result).toBe(false);
    });

    it('should return true when multiple levels are allowed and dto matches one', () => {
      // When
      const result = service['isEidasLevelAllowed'](validDtoEidas2Mock, [
        DatapassEidasLevels.EIDAS_1,
        DatapassEidasLevels.EIDAS_2,
      ]);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when eidasLevels array is empty', () => {
      // When
      const result = service['isEidasLevelAllowed'](validDtoMock, []);

      // Then
      expect(result).toBe(false);
    });

    it('should return false when item.data is undefined', () => {
      // Given
      const itemWithoutData = {} as Partial<DatapassFilterableItemInterface>;

      // When
      const result = service['isEidasLevelAllowed'](itemWithoutData, [
        DatapassEidasLevels.EIDAS_1,
      ]);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('isValidatedAfterDate', () => {
    it('should return true when since is undefined', () => {
      // When
      const result = service['isValidatedAfterDate'](validDtoMock, undefined);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when last_validated_at is falsy', () => {
      // Given
      const dtoWithEmptyDateMock = {
        ...validDtoMock,
        last_validated_at: '',
      } as Partial<DatapassApiResponseInterface>;
      const sinceMock = new Date('2024-01-01T00:00:00Z');

      // When
      const result = service['isValidatedAfterDate'](
        dtoWithEmptyDateMock,
        sinceMock,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return true when last_validated_at is equal to since', () => {
      // Given
      const sinceMock = new Date('2024-01-15T10:00:00Z');
      const dtoWithEqualDateMock: DatapassApiResponseInterface = {
        ...validDtoMock,
        last_validated_at: '2024-01-15T10:00:00Z',
      };

      // When
      const result = service['isValidatedAfterDate'](
        dtoWithEqualDateMock,
        sinceMock,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return true when last_validated_at is after since', () => {
      // Given
      const sinceMock = new Date('2024-01-01T00:00:00Z');

      // When
      const result = service['isValidatedAfterDate'](validDtoMock, sinceMock);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when last_validated_at is before since', () => {
      // Given
      const sinceMock = new Date('2024-12-31T00:00:00Z');

      // When
      const result = service['isValidatedAfterDate'](validDtoMock, sinceMock);

      // Then
      expect(result).toBe(false);
    });
  });
});

import { mocked } from 'jest-mock';

import { ConfigService } from '@fc/config';
import * as httpClient from '@fc/http-client';

import { ServiceProvidersActionTypes, ServiceProvidersOptions } from '../enums';
import { serviceProvidersFailed, serviceProvidersSuccessed } from './actions';
import { requestServiceProviders } from './side-effects';

jest.mock('./actions');
jest.mock('@fc/config');
jest.mock('@fc/http-client');

describe('side-effects', () => {
  // given
  const dispatchMock = jest.fn();
  const configServiceEndpoint = 'any-url-endpoint';
  const itemsMock = [expect.any(Object), expect.any(Object), expect.any(Object)];
  const dataMock = { meta: { totalItems: 100 }, payload: itemsMock };
  const responseMock = {
    config: expect.any(Object),
    data: dataMock,
    headers: expect.any(Object),
    status: expect.any(Object),
    statusText: expect.any(String),
  };
  const actionMock = {
    payload: { items: itemsMock, totalItems: 100 },
    type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_SUCCESSED,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestServiceProviders when promise is resolved', () => {
    beforeEach(() => {
      mocked(httpClient.get).mockResolvedValueOnce(responseMock);
      mocked(serviceProvidersSuccessed).mockReturnValueOnce(actionMock);
      mocked(ConfigService.get).mockReturnValueOnce({ endpoint: configServiceEndpoint });
    });

    it('should call ConfigService with parameters', async () => {
      // given
      const action = {
        type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED,
      };

      // when
      await requestServiceProviders(action, dispatchMock);

      // then
      expect(ConfigService.get).toHaveBeenCalledWith(ServiceProvidersOptions.CONFIG_NAME);
    });

    it('should call httpClient with parameters', async () => {
      // given
      const action = {
        type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED,
      };

      // when
      await requestServiceProviders(action, dispatchMock);

      // then
      expect(httpClient.get).toHaveBeenCalledWith(configServiceEndpoint);
    });

    it('should call the dispatch callback function with parameters', async () => {
      // given
      const action = {
        type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED,
      };

      // when
      await requestServiceProviders(action, dispatchMock);

      // then
      expect(serviceProvidersSuccessed).toHaveBeenCalledWith({
        items: dataMock.payload,
        totalItems: dataMock.meta.totalItems,
      });
      expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });
  });

  describe('requestServiceProviders when promise is rejected', () => {
    beforeEach(() => {
      mocked(httpClient.get).mockRejectedValueOnce(new Error(expect.any(String)));
      mocked(serviceProvidersFailed).mockReturnValueOnce({ type: 'any-event-type' });
    });

    it('should dispatch serviceProvidersFailed action', async () => {
      // given
      const action = {
        type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED,
      };

      // when
      await requestServiceProviders(action, dispatchMock);

      // then
      expect(dispatchMock).toHaveBeenCalledWith({ type: 'any-event-type' });
    });
  });
});

import { FSA } from '@fc/common';

import {
  ServiceProvidersFailed,
  ServiceProvidersRequested,
  ServiceProvidersSuccessed,
} from './reducers';

describe('reducers', () => {
  // given
  const ServiceProvidersMock = {
    items: [],
    loading: false,
    totalItems: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ServiceProvidersFailed', () => {
    it('should return the current state with loading equals false', () => {
      // given
      const InitialStateMock = {
        ServiceProviders: {
          ...ServiceProvidersMock,
          loading: true,
        },
      };
      // when
      const result = ServiceProvidersFailed(InitialStateMock);

      // then
      expect(result.ServiceProviders.loading).toBe(false);
    });
  });

  describe('ServiceProvidersRequested', () => {
    it('should return the current state with loading equals true', () => {
      // given
      const InitialStateMock = {
        ServiceProviders: {
          ...ServiceProvidersMock,
          loading: false,
        },
      };
      // when
      const result = ServiceProvidersRequested(InitialStateMock);

      // then
      expect(result.ServiceProviders.loading).toBe(true);
    });
  });

  describe('ServiceProvidersSuccessed', () => {
    it('should return the current state with payload values and loading equals false', () => {
      // given
      const totalItems = 30;
      const items = [expect.any(Object), expect.any(Object), expect.any(Object)];
      const payloadMock = { items, totalItems };
      const actionMock = { payload: payloadMock } as unknown as FSA;

      const InitialStateMock = {
        ServiceProviders: {
          ...ServiceProvidersMock,
          loading: false,
        },
      };
      // when
      const result = ServiceProvidersSuccessed(InitialStateMock, actionMock);

      // then
      expect(result.ServiceProviders).toStrictEqual({
        items,
        loading: false,
        totalItems,
      });
    });
  });
});

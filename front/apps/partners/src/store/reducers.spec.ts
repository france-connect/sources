import { FSA } from '@fc/common';

import {
  ServiceProviderEditFailed,
  ServiceProviderEditRequested,
  ServiceProviderEditSuccessed,
  ServiceProvidersFailed,
  ServiceProvidersRequested,
  ServiceProvidersSuccessed,
  ServiceProviderViewFailed,
  ServiceProviderViewRequested,
  ServiceProviderViewSuccessed,
} from './reducers';

describe('reducers', () => {
  // given
  const ServiceProvidersMock = {
    items: [],
    loading: false,
    totalItems: 0,
  };

  const ServiceProviderItemMock = {
    item: undefined,
    loading: false,
  };

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

  describe('ServiceProviderEditFailed', () => {
    it('should return the current state with loading equals false', () => {
      // given
      const InitialStateMock = {
        ServiceProviderItem: {
          ...ServiceProviderItemMock,
          loading: true,
        },
      };
      // when
      const result = ServiceProviderEditFailed(InitialStateMock);

      // then
      expect(result.ServiceProviderItem.loading).toBe(false);
    });
  });

  describe('ServiceProviderEditRequested', () => {
    it('should return the current state with loading equals true', () => {
      // given
      const InitialStateMock = {
        ServiceProviderItem: {
          ...ServiceProviderItemMock,
          loading: false,
        },
      };
      // when
      const result = ServiceProviderEditRequested(InitialStateMock);

      // then
      expect(result.ServiceProviderItem.loading).toBe(true);
    });
  });

  describe('ServiceProviderEditSuccessed', () => {
    it('should return the current state with payload values and loading equals false', () => {
      // given
      const item = expect.any(Object);
      const payloadMock = { item };
      const actionMock = { payload: payloadMock } as unknown as FSA;

      const InitialStateMock = {
        ServiceProviderItem: {
          ...ServiceProviderItemMock,
          loading: false,
        },
      };
      // when
      const result = ServiceProviderEditSuccessed(InitialStateMock, actionMock);

      // then
      expect(result.ServiceProviderItem).toStrictEqual({
        item,
        loading: false,
      });
    });
  });

  describe('ServiceProviderViewFailed', () => {
    it('should return the current state with loading equals false', () => {
      // given
      const InitialStateMock = {
        ServiceProviderItem: {
          ...ServiceProviderItemMock,
          loading: true,
        },
      };
      // when
      const result = ServiceProviderViewFailed(InitialStateMock);

      // then
      expect(result.ServiceProviderItem.loading).toBe(false);
    });
  });

  describe('ServiceProviderViewRequested', () => {
    it('should return the current state with loading equals true', () => {
      // given
      const InitialStateMock = {
        ServiceProviderItem: {
          ...ServiceProviderItemMock,
          loading: false,
        },
      };
      // when
      const result = ServiceProviderViewRequested(InitialStateMock);

      // then
      expect(result.ServiceProviderItem.loading).toBe(true);
    });
  });

  describe('ServiceProviderViewSuccessed', () => {
    it('should return the current state with payload values and loading equals false', () => {
      // given
      const item = expect.any(Object);
      const payloadMock = { item };
      const actionMock = { payload: payloadMock } as unknown as FSA;

      const InitialStateMock = {
        ServiceProviderItem: {
          ...ServiceProviderItemMock,
          loading: false,
        },
      };
      // when
      const result = ServiceProviderViewSuccessed(InitialStateMock, actionMock);

      // then
      expect(result.ServiceProviderItem).toStrictEqual({
        item,
        loading: false,
      });
    });
  });
});

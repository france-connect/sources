import { renderHook } from '@testing-library/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ServiceProviderStatusColors } from '../../enums';
import { transformServiceProvider } from '../../services';
import { useServiceProviderDetails } from './service-provider-details.hook';

const serviceProviderItemMock = {
  createdAt: '2022-02-21T23:00:00.000Z',
  datapasses: [{ remoteId: 42 }],
  id: '42',
  name: 'spName',
  organisation: { name: 'organisationName' },
  platform: { name: 'platformName' },
  status: 'SANDBOX',
};
const params = {
  id: '42',
  type: 'SERVICE_PROVIDER_READ_REQUESTED',
};

jest.mock('react-redux');
jest.mock('../../services/transform-service-provider.service');

describe('useServiceProviderDetails', () => {
  let useContextMock: jest.SpyInstance;

  beforeEach(() => {
    // given
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: false });
    jest.mocked(useSelector).mockReturnValueOnce({ item: serviceProviderItemMock });
    jest.mocked(useDispatch).mockReturnValueOnce(jest.fn());
    useContextMock = jest.spyOn(React, 'useContext');
  });

  it('should have returned an object with undefined item, when user is not logged in and item is undefined', () => {
    // given
    useContextMock.mockReturnValue({ connected: false, ready: false });
    jest.mocked(useSelector).mockReturnValueOnce({ item: undefined });

    // when
    const { result } = renderHook(() => useServiceProviderDetails(params));

    // then
    expect(result.current).toStrictEqual({
      item: undefined,
    });
  });

  it('should have returned an object with undefined item, when user is not logged and item is setted', () => {
    // given
    useContextMock.mockReturnValue({ connected: false, ready: false });
    jest.mocked(useSelector).mockReturnValueOnce({ item: serviceProviderItemMock });

    // when
    const { result } = renderHook(() => useServiceProviderDetails(params));

    // then
    expect(result.current).toStrictEqual({
      item: undefined,
    });
  });

  it('should have returned an object with undefined item, when user is logged in', () => {
    // given
    useContextMock.mockReturnValue({ connected: true, ready: true });
    jest.mocked(useSelector).mockReturnValueOnce({ item: undefined });

    // when
    const { result } = renderHook(() => useServiceProviderDetails(params));

    // then
    expect(result.current).toStrictEqual({
      item: undefined,
    });
  });

  it('should call function transformServiceProvider', () => {
    // given
    useContextMock.mockReturnValue({ connected: true, ready: true });
    jest.mocked(useSelector).mockReturnValueOnce({ item: serviceProviderItemMock });

    // when
    renderHook(() => useServiceProviderDetails(params));

    // then
    expect(transformServiceProvider).toHaveBeenCalledTimes(1);
  });

  it('should return item transformed when user is logged in and item exist', () => {
    // given
    const itemTransformed = {
      color: ServiceProviderStatusColors.SANDBOX,
      platformName: 'platformName',
      spName: 'spName',
      status: 'en intégration',
    };

    jest.mocked(useSelector).mockReturnValue({ item: serviceProviderItemMock });
    useContextMock.mockReturnValueOnce({ connected: true, ready: true });
    jest.mocked(transformServiceProvider).mockReturnValueOnce(itemTransformed);

    // when
    const { result } = renderHook(() => useServiceProviderDetails(params));

    // then
    expect(result.current).toStrictEqual({
      item: itemTransformed,
    });
  });
});

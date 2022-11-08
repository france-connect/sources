import { renderHook } from '@testing-library/react';
import { mocked } from 'jest-mock';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ServiceProviderStatusColors } from '../enums';
import { transformServiceProviderItem } from '../services';
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
  type: 'SERVICE_PROVIDER_VIEW_REQUESTED',
};

jest.mock('react-redux');
jest.mock('../services/transform-service-provider-item.service');

describe('useServiceProviderDetails', () => {
  let useContextMock: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    // given
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: false });
    mocked(useSelector).mockReturnValueOnce({ item: serviceProviderItemMock });
    mocked(useDispatch).mockReturnValueOnce(jest.fn());
    useContextMock = jest.spyOn(React, 'useContext');
  });

  it('should have returned an object with undefined item, when user is not logged in and item is undefined', () => {
    // given
    useContextMock.mockReturnValue({ connected: false, ready: false });
    mocked(useSelector).mockReturnValueOnce({ item: undefined });

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
    mocked(useSelector).mockReturnValueOnce({ item: serviceProviderItemMock });

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
    mocked(useSelector).mockReturnValueOnce({ item: undefined });

    // when
    const { result } = renderHook(() => useServiceProviderDetails(params));

    // then
    expect(result.current).toStrictEqual({
      item: undefined,
    });
  });

  it('should call function transformServiceProviderItem', () => {
    // given
    useContextMock.mockReturnValue({ connected: true, ready: true });
    mocked(useSelector).mockReturnValueOnce({ item: serviceProviderItemMock });

    // when
    renderHook(() => useServiceProviderDetails(params));

    // then
    expect(transformServiceProviderItem).toHaveBeenCalledTimes(1);
  });

  it('should return item transformed when user is logged in and item exist', () => {
    // given
    const itemTransformed = {
      color: ServiceProviderStatusColors.SANDBOX,
      platformName: 'platformName',
      spName: 'spName',
      status: 'en intégration',
    };

    mocked(useSelector).mockReturnValue({ item: serviceProviderItemMock });
    useContextMock.mockReturnValueOnce({ connected: true, ready: true });
    mocked(transformServiceProviderItem).mockReturnValueOnce(itemTransformed);

    // when
    const { result } = renderHook(() => useServiceProviderDetails(params));

    // then
    expect(result.current).toStrictEqual({
      item: itemTransformed,
    });
  });
});

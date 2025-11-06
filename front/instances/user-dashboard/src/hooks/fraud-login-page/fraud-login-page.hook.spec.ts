import { renderHook } from '@testing-library/react';
import { useLocation } from 'react-router';
import { useToggle } from 'usehooks-ts';

import { ConfigService } from '@fc/config';

import { useFraudLoginPage } from './fraud-login-page.hook';

describe('useFraudLoginPage', () => {
  // Given
  const locationMock = {
    state: {
      from: {
        search: '?redirect=somewhere',
      },
    },
  } as unknown as ReturnType<typeof useLocation>;
  const toggleExpandedMock = jest.fn() as unknown as () => void;
  const toggleExpandedValueMock = Symbol('toggleExpandedValueMock') as unknown as boolean;

  beforeEach(() => {
    // Given
    jest.mocked(useLocation).mockReturnValue(locationMock);
    jest
      .mocked(useToggle)
      .mockReturnValue([toggleExpandedValueMock, toggleExpandedMock, jest.fn()]);
    jest.mocked(ConfigService.get).mockReturnValue({
      identityTheftReportRoute: 'any-identity-theft-route-mock',
    });
  });

  it('should call ConfigService.get with correct params', () => {
    // When
    renderHook(() => useFraudLoginPage());

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('Fraud');
  });

  it('should call useToggle hook', () => {
    // When
    renderHook(() => useFraudLoginPage());

    // Then
    expect(useToggle).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('should call useLocation hook', () => {
    // When
    renderHook(() => useFraudLoginPage());

    // Then
    expect(useLocation).toHaveBeenCalled();
  });

  it('should return the correct params', () => {
    // When
    const { result } = renderHook(() => useFraudLoginPage());

    // Then
    expect(result.current).toStrictEqual({
      expanded: toggleExpandedValueMock,
      identityTheftReportRoute: 'any-identity-theft-route-mock',
      search: '?redirect=somewhere',
      toggleExpanded: toggleExpandedMock,
    });
  });

  it('should return the correct search params when location is empty', () => {
    // Given
    jest.mocked(useLocation).mockReturnValueOnce({} as unknown as ReturnType<typeof useLocation>);

    // When
    const { result } = renderHook(() => useFraudLoginPage());

    // Then
    expect(result.current).toStrictEqual({
      expanded: toggleExpandedValueMock,
      identityTheftReportRoute: 'any-identity-theft-route-mock',
      search: '',
      toggleExpanded: toggleExpandedMock,
    });
  });
});

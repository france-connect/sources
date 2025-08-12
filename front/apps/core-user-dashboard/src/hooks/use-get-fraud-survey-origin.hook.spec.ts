import { renderHook } from '@testing-library/react';
import { useLocalStorage } from 'usehooks-ts';

import type { FraudConfigInterface } from '../interfaces';
import { useGetFraudSurveyOrigin } from './use-get-fraud-survey-origin.hook';

describe('useGetFraudSurveyOrigin', () => {
  // Given
  const options: FraudConfigInterface = {
    apiRouteFraudForm: 'any-route',
    fraudSupportFormPathname: 'any-pathname',
    fraudSurveyUrl: 'any-url',
    supportFormUrl: 'any-url',
    surveyOriginQueryParam: 'any-param',
  };

  const nowMock = 1860000;

  const getMock = jest.fn();
  const URLSearchParamsMock = jest.fn().mockImplementation(() => ({
    get: getMock,
  }));

  global.URLSearchParams = URLSearchParamsMock;

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(nowMock);
  });

  it('should call useLocalStorage hook with surveyOriginQueryParam', () => {
    // When
    renderHook(() => useGetFraudSurveyOrigin(options));

    // Then
    expect(useLocalStorage).toHaveBeenCalledOnce();
    expect(useLocalStorage).toHaveBeenCalledWith(options.surveyOriginQueryParam, {
      createdAt: expect.any(Number),
      value: '',
    });
  });

  it('should call searchParams.get with surveyOriginQueryParam', () => {
    // When
    renderHook(() => useGetFraudSurveyOrigin(options));

    // Then
    expect(getMock).toHaveBeenCalledOnce();
    expect(getMock).toHaveBeenCalledWith(options.surveyOriginQueryParam);
  });

  it('should set localFraudSurveyOrigin as currentFraudSurveyOrigin', async () => {
    // Given
    getMock.mockReturnValueOnce('mock-origin');
    const setLocalStorageMock = jest.fn();
    jest
      .mocked(useLocalStorage)
      .mockReturnValueOnce([
        { createdAt: expect.any(Number), value: '' },
        setLocalStorageMock,
        jest.fn(),
      ]);

    // When
    renderHook(() => useGetFraudSurveyOrigin(options));

    // Then
    expect(setLocalStorageMock).toHaveBeenCalledOnce();
    expect(setLocalStorageMock).toHaveBeenCalledWith({
      createdAt: nowMock,
      value: 'mock-origin',
    });
  });

  it('should remove localFraudSurveyOrigin if expired', async () => {
    // Given
    const nowMockMinus30Min = 59000;
    const removeLocalStorageMock = jest.fn();
    jest
      .mocked(useLocalStorage)
      .mockReturnValueOnce([
        { createdAt: nowMockMinus30Min, value: 'mock-origin' },
        jest.fn(),
        removeLocalStorageMock,
      ]);

    // When
    renderHook(() => useGetFraudSurveyOrigin(options));

    // Then
    expect(removeLocalStorageMock).toHaveBeenCalledOnce();
  });

  it('should return localFraudSurveyOrigin', async () => {
    // Given
    const nowMockMinus1Min = 1800000;

    jest
      .mocked(useLocalStorage)
      .mockReturnValueOnce([
        { createdAt: nowMockMinus1Min, value: 'mock-origin' },
        jest.fn(),
        jest.fn(),
      ]);

    // When
    const { result } = renderHook(() => useGetFraudSurveyOrigin(options));

    // Then
    expect(result.current).toBe('mock-origin');
  });
});

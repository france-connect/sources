import { renderHook } from '@testing-library/react';
import React from 'react';
import { useLoaderData, useNavigate } from 'react-router';

import { ConfigService } from '@fc/config';
import { removeEmptyValues, useSubmitHandler } from '@fc/dto2form';
import { t } from '@fc/i18n';

import { useSummaryPage } from './summary-page.hook';

describe('useSummaryPage', () => {
  // Given
  const useSubmitHandlerMock = jest.fn();
  const schemaMock = Symbol('schemaMock');
  const summaryMock = {
    contact: {
      phone: expect.any(String),
    },
  };
  const IdentityTheftSummaryMock = Symbol('IdentityTheftSummaryMock');

  const configMock = {
    IdentityTheftSummary: IdentityTheftSummaryMock,
  };

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue(configMock);
    jest.mocked(useSubmitHandler).mockReturnValue(useSubmitHandlerMock);
    jest.mocked(useLoaderData).mockReturnValue({ form: schemaMock, summary: summaryMock });
  });

  it('should return the expected values', () => {
    // Given
    const callbackMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockImplementationOnce(() => callbackMock);

    // When
    const { result } = renderHook(() => useSummaryPage());

    // Then
    expect(result.current).toStrictEqual({
      config: IdentityTheftSummaryMock,
      onPostSubmit: callbackMock,
      onPreSubmit: removeEmptyValues,
      onSubmit: useSubmitHandlerMock,
      schema: schemaMock,
      values: summaryMock,
    });
  });

  it('should call the route loader data', () => {
    // When
    renderHook(() => useSummaryPage());

    // Then
    expect(useLoaderData).toHaveBeenCalledOnce();
  });

  it('should navigate with the success url on postSubmit', () => {
    // Given
    const navigateMock = jest.fn();
    jest.mocked(useNavigate).mockReturnValueOnce(navigateMock);

    // When
    const { result } = renderHook(() => useSummaryPage());
    result.current.onPostSubmit();

    // Then
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith('../success');
  });

  it('should call Config.get with the key', () => {
    // When
    renderHook(() => useSummaryPage());

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('Dto2Form');
  });

  it('should call useSubmitHandler with the config', () => {
    // When
    renderHook(() => useSummaryPage());

    // Then
    expect(useSubmitHandler).toHaveBeenCalledExactlyOnceWith(IdentityTheftSummaryMock);
  });

  it('should replace the phone value if undefined', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValueOnce({
      form: schemaMock,
      summary: {
        contact: {
          phone: undefined,
        },
      },
    });
    jest.mocked(t).mockReturnValueOnce('Form.phone.notAvailable--mock');

    // When
    const { result } = renderHook(() => useSummaryPage());

    // Then
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Fraud.IdentityTheftReport.summaryNoPhone');

    // Then
    expect(result.current.values).toStrictEqual({
      contact: {
        phone: 'Form.phone.notAvailable--mock',
      },
    });
  });
});

import { renderHook } from '@testing-library/react';
import React from 'react';
import { useLoaderData, useNavigate } from 'react-router';

import { useSafeContext } from '@fc/common';
import { removeEmptyValues } from '@fc/dto2form';
import { useDto2FormSubmitHandler } from '@fc/dto2form-service';

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

  const configMock = {
    endpoints: {
      load: {
        path: '/test/load',
      },
      schema: {
        path: '/test/schema',
      },
    },
    form: {
      id: 'any-form-id-mock',
    },
  };
  const contextMock = {
    getConfigEndpointsById: jest.fn().mockReturnValue(configMock.endpoints),
    getConfigFormById: jest.fn().mockReturnValue(configMock.form),
  };

  beforeEach(() => {
    // Given
    jest.mocked(useLoaderData).mockReturnValue({
      data: {
        form: schemaMock,
        summary: summaryMock,
      },
    });
    jest.mocked(useSafeContext).mockReturnValue(contextMock);
    jest.mocked(useDto2FormSubmitHandler).mockReturnValue(useSubmitHandlerMock);
  });

  it('should call the route loader data', () => {
    // When
    renderHook(() => useSummaryPage());

    // Then
    expect(useLoaderData).toHaveBeenCalledOnce();
  });

  it('should call useDto2FormSubmitHandler with the config', () => {
    // When
    renderHook(() => useSummaryPage());

    // Then
    expect(useDto2FormSubmitHandler).toHaveBeenCalledExactlyOnceWith(configMock.endpoints);
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

  it('should return the expected values', () => {
    // Given
    const callbackMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockImplementationOnce(() => callbackMock);

    // When
    const { result } = renderHook(() => useSummaryPage());

    // Then
    expect(result.current).toStrictEqual({
      config: configMock.form,
      onPostSubmit: callbackMock,
      onPreSubmit: removeEmptyValues,
      onSubmit: useSubmitHandlerMock,
      schema: schemaMock,
      summary: summaryMock,
    });
  });
});

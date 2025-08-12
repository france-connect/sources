import { renderHook } from '@testing-library/react';
import { useMemo } from 'react';
import { useRouteLoaderData } from 'react-router';

import { parseInitialValues } from '../../helpers';
import type { Dto2FormFormConfigInterface } from '../../interfaces';
import { useSubmitHandler } from '../submit-handler';
import { useDto2Form } from './dto2form.hook';

jest.mock('../submit-handler', () => ({
  useSubmitHandler: jest.fn(() => jest.fn()),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn((fn) => fn()),
}));

jest.mock('../../helpers', () => ({
  parseInitialValues: jest.fn(() => ({})),
}));

describe('useDto2Form', () => {
  const formMock = {
    endpoints: {
      load: {
        path: '/test/load',
      },
      schema: {
        path: '/test/schema',
      },
    },
  };
  const parseInitialValuesMock = jest.mocked(parseInitialValues);

  beforeEach(() => {
    jest.mocked(useRouteLoaderData).mockReturnValue([]);
  });

  it('should get schema from loader data', () => {
    // When
    renderHook(() => useDto2Form(formMock as Dto2FormFormConfigInterface));

    // Then
    expect(useRouteLoaderData).toHaveBeenCalledWith(formMock.endpoints.schema.path);
  });

  it('should get values from loader data', () => {
    // When
    renderHook(() => useDto2Form(formMock as Dto2FormFormConfigInterface));

    // Then
    expect(useRouteLoaderData).toHaveBeenCalledWith(formMock.endpoints.load.path);
  });

  it('should filter out readonly fields if no data was loaded', () => {
    // Given
    jest.mocked(useRouteLoaderData).mockReturnValueOnce([
      { name: 'field1', readonly: true },
      { name: 'field2', readonly: false },
    ]);
    jest.mocked(useRouteLoaderData).mockReturnValueOnce(undefined);

    // When
    const { result } = renderHook(() => useDto2Form(formMock as Dto2FormFormConfigInterface));

    // Then
    expect(result.current.schema).toEqual([{ name: 'field2', readonly: false }]);
  });

  it('should parse initial values', () => {
    // Given
    const schemaMock = [{ name: 'field1' }];
    const parsedValuesMock = { parsed: 'values' };
    const loadedValuesMock = { loaded: 'values' };

    parseInitialValuesMock.mockReturnValueOnce(parsedValuesMock);

    jest
      .mocked(useRouteLoaderData)
      .mockReturnValueOnce(schemaMock)
      .mockReturnValueOnce(loadedValuesMock);
    // When
    const { result } = renderHook(() => useDto2Form(formMock as Dto2FormFormConfigInterface));

    // Then
    expect(parseInitialValuesMock).toHaveBeenCalledWith(schemaMock, loadedValuesMock);
    expect(result.current.initialValues).toEqual(parsedValuesMock);
  });

  it('should generate submit handler', () => {
    // Given
    const submitHandlerMock = jest.fn();
    jest.mocked(useSubmitHandler).mockReturnValue(submitHandlerMock);

    // When
    const { result } = renderHook(() => useDto2Form(formMock as Dto2FormFormConfigInterface));

    // Then
    expect(useSubmitHandler).toHaveBeenCalledWith(formMock);
    expect(typeof result.current.submitHandler).toBe('function');
  });

  it('should memoize the result', () => {
    // Given
    const memoizedResult = Symbol('memoizedResult');
    jest.mocked(useMemo).mockReturnValueOnce(memoizedResult);

    // When
    const { result } = renderHook(() => useDto2Form(formMock as Dto2FormFormConfigInterface));

    // Then
    expect(result.current).toBe(memoizedResult);
  });

  it('should return initial values, schema and submit handler', () => {
    // Given
    const initialValuesMock = { field1: 'value1' };
    const schemaMock = [{ name: 'field1' }];
    const submitHandlerMock = jest.fn();

    parseInitialValuesMock.mockReset().mockReturnValueOnce(initialValuesMock);
    jest.mocked(useSubmitHandler).mockReturnValueOnce(submitHandlerMock);
    jest.mocked(useRouteLoaderData).mockReturnValueOnce(schemaMock);

    // When
    const { result } = renderHook(() => useDto2Form(formMock as Dto2FormFormConfigInterface));

    // Then
    expect(result.current).toEqual({
      initialValues: initialValuesMock,
      schema: schemaMock,
      submitHandler: submitHandlerMock,
    });
  });
});

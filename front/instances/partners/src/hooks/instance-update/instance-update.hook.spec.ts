import { renderHook } from '@testing-library/react';
import { useLoaderData } from 'react-router';

import type { SchemaFieldType } from '@fc/dto2form';
import { normalizeEmptyValues } from '@fc/dto2form';
import { parseInitialValues, useDto2FormService } from '@fc/dto2form-service';
import { useNavigateWithState } from '@fc/routing';

import { useInstanceUpdate } from './instance-update.hook';

describe('useInstanceUpdate', () => {
  // Given
  const currentVersionMock = {
    data: {
      name: 'Test Instance',
    },
  };

  const schemaMock = Symbol('any-acme-schema') as unknown as SchemaFieldType[];
  const schemaInitialValuesMock = { defaultField: 'default-value' };
  const formInitialValuesMock = currentVersionMock.data;
  const preSubmitMock = jest.fn();
  const submitHandlerMock = jest.fn();
  const formMock = {
    id: 'any-acme-form-id',
  };

  const UseDto2FormServiceResult = {
    form: formMock,
    initialValues: formInitialValuesMock,
    schema: schemaMock,
    submitHandler: submitHandlerMock,
  };

  beforeEach(() => {
    // Given
    jest
      .mocked(parseInitialValues)
      .mockReturnValueOnce(formInitialValuesMock)
      .mockReturnValueOnce(schemaInitialValuesMock);
    jest.mocked(normalizeEmptyValues).mockReturnValue(preSubmitMock);
    jest.mocked(useDto2FormService).mockReturnValue(UseDto2FormServiceResult);
    jest.mocked(useLoaderData).mockReturnValue({
      data: {
        payload: {
          currentVersion: currentVersionMock,
        },
      },
    });
  });

  it('should call useLoaderData', () => {
    // When
    renderHook(() => useInstanceUpdate());

    // Then
    expect(useLoaderData).toHaveBeenCalledExactlyOnceWith();
  });

  it('should call useDto2FormService with parameter', () => {
    // When
    renderHook(() => useInstanceUpdate());

    // Then
    expect(useDto2FormService).toHaveBeenCalledExactlyOnceWith('InstancesUpdate');
  });

  it('should call useNavigateWithState with parameter', () => {
    // When
    renderHook(() => useInstanceUpdate());

    // Then
    expect(useNavigateWithState).toHaveBeenCalledExactlyOnceWith();
  });

  it('should call goBackWithSuccess with parameter', () => {
    // Given
    const goBackWithSuccessMock = jest.fn();
    jest.mocked(useNavigateWithState).mockReturnValueOnce({
      goBack: jest.fn(),
      goBackWithError: jest.fn(),
      goBackWithSuccess: goBackWithSuccessMock,
      navigateWithState: jest.fn(),
    });

    // When
    const { result } = renderHook(() => useInstanceUpdate());
    result.current.postSubmit();

    // Then
    expect(goBackWithSuccessMock).toHaveBeenCalledExactlyOnceWith({
      title: 'Partners.instance.successUpdate',
    });
  });

  it('should call parseInitialValues for schema defaults and form values', () => {
    // When
    renderHook(() => useInstanceUpdate());

    // Then
    expect(parseInitialValues).toHaveBeenCalledTimes(2);
    expect(parseInitialValues).toHaveBeenNthCalledWith(1, schemaMock, currentVersionMock.data);
    expect(parseInitialValues).toHaveBeenNthCalledWith(2, schemaMock);
  });

  it('should call normalizeEmptyValues with parsed schema defaults', () => {
    // When
    renderHook(() => useInstanceUpdate());

    // Then
    expect(normalizeEmptyValues).toHaveBeenCalledExactlyOnceWith(schemaInitialValuesMock);
  });

  it('should return the correct configuration', () => {
    // When
    const { result } = renderHook(() => useInstanceUpdate());

    // Then
    expect(result.current).toStrictEqual({
      config: {
        ...formMock,
        title: currentVersionMock.data.name,
      },
      initialValues: formInitialValuesMock,
      postSubmit: expect.any(Function),
      preSubmit: preSubmitMock,
      schema: schemaMock,
      submitHandler: submitHandlerMock,
    });
  });

  it('should not return the config title, when title is undefined in version', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValueOnce({
      data: {
        payload: {
          currentVersion: {},
        },
      },
    });

    // When
    const { result } = renderHook(() => useInstanceUpdate());

    // Then
    expect(result.current).toStrictEqual(
      expect.objectContaining({
        config: {
          ...formMock,
          title: undefined,
        },
      }),
    );
  });

  it('should not return the config title, when current version is empty', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValueOnce({
      data: {
        payload: {
          currentVersion: undefined,
        },
      },
    });

    // When
    const { result } = renderHook(() => useInstanceUpdate());

    // Then
    expect(result.current).toStrictEqual(
      expect.objectContaining({
        config: {
          ...formMock,
          title: undefined,
        },
      }),
    );
  });
});

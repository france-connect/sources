import { renderHook } from '@testing-library/react';

import type { SchemaFieldType } from '@fc/dto2form';
import { removeEmptyValues } from '@fc/dto2form';
import { useDto2FormService } from '@fc/dto2form-service';
import type { FormConfigInterface } from '@fc/forms';
import { useNavigateWithState } from '@fc/routing';

import { useInstanceCreate } from './instance-create.hook';

describe('useInstanceCreate', () => {
  // Given
  const formMock = Symbol('any-form-mock') as unknown as FormConfigInterface;
  const initialValuesMock = Symbol('any-initial-values-mock') as unknown as Record<string, unknown>;
  const schemaMock = Symbol('any-schema-mock') as unknown as SchemaFieldType[];
  const submitHandlerMock = jest.fn();
  const UseDto2FormServiceResult = {
    form: formMock,
    initialValues: initialValuesMock,
    schema: schemaMock,
    submitHandler: submitHandlerMock,
  };

  beforeEach(() => {
    // Given
    jest.mocked(useDto2FormService).mockReturnValue(UseDto2FormServiceResult);
  });

  it('should call useDto2FormService with parameter', () => {
    // When
    renderHook(() => useInstanceCreate());

    // Then
    expect(useDto2FormService).toHaveBeenCalledExactlyOnceWith('InstancesCreate');
  });

  it('should call useNavigateWithState with parameter', () => {
    // When
    renderHook(() => useInstanceCreate());

    // Then
    expect(useNavigateWithState).toHaveBeenCalledExactlyOnceWith();
  });

  it('should return the correct configuration', () => {
    // When
    const { result } = renderHook(() => useInstanceCreate());
    const { config, initialValues, postSubmit, preSubmit, schema, submitHandler } = result.current;

    // Then
    expect(config).toStrictEqual(formMock);
    expect(initialValues).toStrictEqual(initialValuesMock);
    expect(postSubmit).toStrictEqual(expect.any(Function));
    expect(preSubmit).toBe(removeEmptyValues);
    expect(schema).toStrictEqual(schemaMock);
    expect(submitHandler).toStrictEqual(submitHandlerMock);
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
    const { result } = renderHook(() => useInstanceCreate());
    result.current.postSubmit();

    // Then
    expect(goBackWithSuccessMock).toHaveBeenCalledExactlyOnceWith({
      title: 'Partners.instance.successCreate',
    });
  });
});

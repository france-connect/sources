import { renderHook } from '@testing-library/react';
import { useRevalidator } from 'react-router';

import { PartnersAlertVariants } from '@fc/core-partners';
import type { SchemaFieldType } from '@fc/dto2form';
import { removeEmptyValues } from '@fc/dto2form';
import { useDto2FormService } from '@fc/dto2form-service';
import { t } from '@fc/i18n';
import { useNavigateWithState } from '@fc/routing';

import { useServiceProviderCreateInstance } from './service-provider-create-instance.hook';

describe('useServiceProviderCreateInstance', () => {
  // Given
  const formMock = { id: 'Dto2Form-service-provider-create-instance' };
  const initialValuesMock = { name: 'any-name-mock' };
  const schemaMock = [{ name: 'name' }] as unknown as SchemaFieldType[];
  const submitHandlerMock = jest.fn();

  const useDto2FormServiceResultMock = {
    form: formMock,
    initialValues: initialValuesMock,
    schema: schemaMock,
    submitHandler: submitHandlerMock,
  };

  beforeEach(() => {
    // Given
    jest.mocked(useDto2FormService).mockReturnValue(useDto2FormServiceResultMock);
  });

  it('should call useDto2FormService with parameter', () => {
    // When
    renderHook(() => useServiceProviderCreateInstance());

    // Then
    expect(useDto2FormService).toHaveBeenCalledOnce();
    expect(useDto2FormService).toHaveBeenCalledWith('ServiceProviderCreateInstance');
  });

  it('should return the correct configuration', () => {
    // When
    const { result } = renderHook(() => useServiceProviderCreateInstance());

    // Then
    expect(result.current).toStrictEqual({
      config: formMock,
      initialValues: initialValuesMock,
      postSubmit: expect.any(Function),
      preSubmit: removeEmptyValues,
      schema: schemaMock,
      submitHandler: submitHandlerMock,
    });
  });

  it('should call useNavigateWithState', () => {
    // When
    renderHook(() => useServiceProviderCreateInstance());

    // Then
    expect(useNavigateWithState).toHaveBeenCalledExactlyOnceWith();
  });

  it('should call useRevalidator', () => {
    // When
    renderHook(() => useServiceProviderCreateInstance());

    // Then
    expect(useRevalidator).toHaveBeenCalledExactlyOnceWith();
  });

  it('should call revalidate and goBackWithSuccess with parameter', () => {
    // Given
    const goBackWithSuccessMock = jest.fn();
    const revalidateMock = jest.fn();
    const valuesMock = { name: 'any-instance-name-mock' };
    jest.mocked(useRevalidator).mockReturnValueOnce({
      revalidate: revalidateMock,
      state: 'idle',
    });
    jest.mocked(useNavigateWithState).mockReturnValueOnce({
      goBack: jest.fn(),
      goBackWithError: jest.fn(),
      goBackWithSuccess: goBackWithSuccessMock,
      navigateWithState: jest.fn(),
    });

    // When
    const { result } = renderHook(() => useServiceProviderCreateInstance());
    result.current.postSubmit(valuesMock);

    // Then
    expect(revalidateMock).toHaveBeenCalledExactlyOnceWith();
    expect(t).toHaveBeenCalledWith('Partners.serviceProvider.createInstance.success', {
      instanceName: valuesMock.name,
    });
    expect(goBackWithSuccessMock).toHaveBeenCalledExactlyOnceWith({
      title: 'Partners.serviceProvider.createInstance.success',
      variant: PartnersAlertVariants.INSTANCE,
    });
  });
});

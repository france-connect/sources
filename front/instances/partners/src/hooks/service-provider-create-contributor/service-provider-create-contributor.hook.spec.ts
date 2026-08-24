import { renderHook } from '@testing-library/react';
import { useRevalidator } from 'react-router';

import { Strings } from '@fc/common';
import { PartnersAlertVariants } from '@fc/core-partners';
import { ButtonTypes, Priorities } from '@fc/dsfr';
import type { SchemaFieldType } from '@fc/dto2form';
import { removeEmptyValues } from '@fc/dto2form';
import { useDto2FormService } from '@fc/dto2form-service';
import type { FormActionsInterface, FormConfigInterface } from '@fc/forms';
import { t } from '@fc/i18n';
import { useNavigateWithState } from '@fc/routing';

import { useServiceProviderCreateContributor } from './service-provider-create-contributor.hook';

describe('useServiceProviderCreateContributor', () => {
  // Given
  const formMock = { id: 'any-form-id-mock' } as unknown as FormConfigInterface;
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
    renderHook(() => useServiceProviderCreateContributor());

    // Then
    expect(useDto2FormService).toHaveBeenCalledExactlyOnceWith('ContributorCreate');
  });

  it('should call useNavigateWithState with parameter', () => {
    // When
    renderHook(() => useServiceProviderCreateContributor());

    // Then
    expect(useNavigateWithState).toHaveBeenCalledExactlyOnceWith();
  });

  it('should return the correct configuration', () => {
    // When
    const { result } = renderHook(() => useServiceProviderCreateContributor());
    const { config, initialValues, postSubmit, preSubmit, schema, submitHandler } = result.current;

    // Then
    expect(config).toStrictEqual({
      ...formMock,
      actions: [
        {
          label: 'Form.cancel',
          onClick: expect.any(Function),
          priority: Priorities.SECONDARY,
          type: ButtonTypes.BUTTON,
        },
        {
          disabled: expect.any(Function),
          label: 'Partners.serviceProviderPage.usersSection.contributorCreate.submit',
          type: ButtonTypes.SUBMIT,
        },
      ],
    });
    expect(initialValues).toStrictEqual(initialValuesMock);
    expect(postSubmit).toStrictEqual(expect.any(Function));
    expect(preSubmit).toBe(removeEmptyValues);
    expect(schema).toStrictEqual(schemaMock);
    expect(submitHandler).toStrictEqual(submitHandlerMock);
  });

  it('should navigate back when the cancel action is triggered', () => {
    // Given
    const goBackMock = jest.fn();
    jest.mocked(useNavigateWithState).mockReturnValueOnce({
      goBack: goBackMock,
      goBackWithError: jest.fn(),
      goBackWithSuccess: jest.fn(),
      navigateWithState: jest.fn(),
    });

    // When
    const { result } = renderHook(() => useServiceProviderCreateContributor());
    const actions = result.current.config.actions as FormActionsInterface[];
    const [cancelAction] = actions;
    (cancelAction.onClick as () => void)();

    // Then
    expect(goBackMock).toHaveBeenCalledExactlyOnceWith();
  });

  it('should disable the submit action while the form is submitting', () => {
    // When
    const { result } = renderHook(() => useServiceProviderCreateContributor());
    const actions = result.current.config.actions as FormActionsInterface[];
    const [, submitAction] = actions;
    const isSubmitDisabled = submitAction.disabled as (params: { canSubmit: boolean }) => boolean;

    // Then
    expect(isSubmitDisabled({ canSubmit: false })).toBeTrue();
    expect(isSubmitDisabled({ canSubmit: true })).toBeFalse();
  });

  it('should call useRevalidator', () => {
    // When
    renderHook(() => useServiceProviderCreateContributor());

    // Then
    expect(useRevalidator).toHaveBeenCalledExactlyOnceWith();
  });

  it('should call revalidate and goBackWithSuccess with the invited email and title', () => {
    // Given
    const emailMock = 'any-email-mock';
    const goBackWithSuccessMock = jest.fn();
    const revalidateMock = jest.fn();
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
    const { result } = renderHook(() => useServiceProviderCreateContributor());
    result.current.postSubmit({ email: emailMock });

    // Then
    expect(revalidateMock).toHaveBeenCalledExactlyOnceWith();
    expect(t).toHaveBeenCalledWith(
      'Partners.serviceProviderPage.usersSection.contributorCreate.success.description',
      { email: emailMock },
    );
    expect(t).toHaveBeenCalledWith(
      'Partners.serviceProviderPage.usersSection.contributorCreate.success',
      { NBSP_UNICODE: Strings.NBSP_UNICODE },
    );
    expect(goBackWithSuccessMock).toHaveBeenCalledExactlyOnceWith({
      message: 'Partners.serviceProviderPage.usersSection.contributorCreate.success.description',
      title: 'Partners.serviceProviderPage.usersSection.contributorCreate.success',
      variant: PartnersAlertVariants.CONTRIBUTOR,
    });
  });
});

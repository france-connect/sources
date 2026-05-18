import { fireEvent } from '@testing-library/react';
import { useFormState } from 'react-final-form';

import { AlertComponent, SimpleButton, ToggleInput } from '@fc/dsfr';
import { renderWithFinalForm } from '@fc/testing-library';

import { useUserPreferencesForm } from '../hooks';
import { AllowFutureIdpSwitchLabelComponent } from './allow-future-idp-switch-label.component';
import { ServicesListComponent } from './services-list.component';
import { UserPreferencesFormComponent } from './user-preferences-form.component';

jest.mock('../hooks');
jest.mock('./services-list.component');
jest.mock('./allow-future-idp-switch-label.component');

describe('UserPreferencesFormComponent', () => {
  const userPreferencesMock = {
    allowFutureIdp: false,
    idpList: [expect.any(Object), expect.any(Object)],
  };
  const alertInfoStateMock = {
    hasInteractedWithAlertInfo: true,
    isDisplayedAlertInfo: false,
  };
  const hookResultMock = {
    alertInfoState: alertInfoStateMock,
    allowingIdPConfirmation: jest.fn(),
  };
  const useFormStateMock = {
    dirty: undefined,
    dirtyFields: undefined,
    hasValidationErrors: undefined,
    pristine: undefined,
    submitting: undefined,
  };

  beforeEach(() => {
    // Given
    jest.mocked(useFormState).mockReturnValue(useFormStateMock);
  });

  it('should match the snapshot', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // When
    const { container } = renderWithFinalForm(
      <UserPreferencesFormComponent
        submitWithSuccess={false}
        userPreferences={userPreferencesMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when form validation button is not disabled', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest.mocked(useFormState).mockReturnValue({ ...useFormStateMock, pristine: false });

    // When
    const { container } = renderWithFinalForm(
      <UserPreferencesFormComponent
        submitWithSuccess={false}
        userPreferences={userPreferencesMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when the form has errors', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest.mocked(useFormState).mockReturnValue({ ...useFormStateMock, hasValidationErrors: true });

    // When
    const { container } = renderWithFinalForm(
      <UserPreferencesFormComponent
        submitWithSuccess={false}
        userPreferences={userPreferencesMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call ServicesListComponent with params', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // When
    renderWithFinalForm(
      <UserPreferencesFormComponent
        submitWithSuccess={false}
        userPreferences={userPreferencesMock}
      />,
    );

    // Then
    expect(ServicesListComponent).toHaveBeenCalledOnce();
    expect(ServicesListComponent).toHaveBeenCalledWith(
      { identityProviders: userPreferencesMock.idpList },
      undefined,
    );
  });

  it('should call ToggleInput with params', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // When
    renderWithFinalForm(
      <UserPreferencesFormComponent
        submitWithSuccess={false}
        userPreferences={userPreferencesMock}
      />,
    );

    // Then
    expect(ToggleInput).toHaveBeenCalledOnce();
    expect(ToggleInput).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValue: false,
        label: expect.any(Function),
        legend: { checked: 'Autorisé', unchecked: 'Bloqué' },
        name: 'allowFutureIdp',
      }),
      undefined,
    );
  });

  it('should render AllowFutureIdpSwitchLabelComponent with params, when labelCallback is called', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    const toggleInputValue = false;
    jest
      .mocked(ToggleInput)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      .mockImplementationOnce(({ label }) => <div>{(label as Function)(toggleInputValue)}</div>);
    // When
    renderWithFinalForm(
      <UserPreferencesFormComponent
        submitWithSuccess={false}
        userPreferences={userPreferencesMock}
      />,
    );

    // Then
    expect(AllowFutureIdpSwitchLabelComponent).toHaveBeenCalledOnce();
    expect(AllowFutureIdpSwitchLabelComponent).toHaveBeenCalledWith(
      { checked: toggleInputValue },
      undefined,
    );
  });

  it('should call AlertComponent with params when the form has errors', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest
      .mocked(AlertComponent)
      .mockImplementationOnce(({ children }) => <div data-mockid="AlertComponent">{children}</div>);
    jest.mocked(useFormState).mockReturnValue({ ...useFormStateMock, hasValidationErrors: true });

    // When
    const { container, getByText } = renderWithFinalForm(
      <UserPreferencesFormComponent
        submitWithSuccess={false}
        userPreferences={userPreferencesMock}
      />,
    );
    const textElt1 = getByText(
      'Attention, vous devez avoir au moins un compte autorisé pour continuer à utiliser FranceConnect.',
    );
    const textElt2 = getByText(
      'Veuillez choisir au moins un compte autorisé pour pouvoir enregistrer vos réglages.',
    );
    const textContainerElt = container.querySelector('.fr-alert__title');

    // Then
    expect(container).toMatchSnapshot();
    expect(AlertComponent).toHaveBeenCalledOnce();
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Array),
        type: 'error',
      },
      undefined,
    );
    expect(textContainerElt).toBeInTheDocument();
    expect(textElt1).toBeInTheDocument();
    expect(textElt2).toBeInTheDocument();
  });

  it('should call useUserPreferencesForm with dirtyFields and userPreference when allowingIdPConfirmation is called', () => {
    // Given
    jest
      .mocked(AlertComponent)
      .mockImplementationOnce(({ children }) => <div data-mockid="AlertComponent">{children}</div>);
    jest.mocked(useUserPreferencesForm).mockReturnValue({
      alertInfoState: {
        hasInteractedWithAlertInfo: false,
        isDisplayedAlertInfo: true,
      },
      allowingIdPConfirmation: jest.fn(),
    });
    jest.mocked(useFormState).mockReturnValue({ ...useFormStateMock, dirty: true });

    // When
    const { getByTestId } = renderWithFinalForm(
      <UserPreferencesFormComponent
        submitWithSuccess={false}
        userPreferences={userPreferencesMock}
      />,
    );
    const button = getByTestId('UserPreferenceFormComponent-button-info');
    fireEvent.click(button);

    // Then
    expect(useUserPreferencesForm).toHaveBeenCalledOnce();
    expect(useUserPreferencesForm).toHaveBeenCalledWith({
      dirtyFields: {},
      userPreferences: userPreferencesMock,
    });
  });

  it('should not call AlertComponent if there are no errors', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest
      .mocked(AlertComponent)
      .mockImplementationOnce(({ children }) => <div data-mockid="AlertComponent">{children}</div>);
    jest.mocked(useFormState).mockReturnValue({ ...useFormStateMock, hasValidationErrors: false });

    // When
    const { container, queryByText } = renderWithFinalForm(
      <UserPreferencesFormComponent
        submitWithSuccess={false}
        userPreferences={userPreferencesMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(AlertComponent).not.toHaveBeenCalled();
    expect(container.querySelector('.fr-alert__title')).not.toBeInTheDocument();
    expect(
      queryByText(
        'Attention, vous devez avoir au moins un compte autorisé pour continuer à utiliser FranceConnect.',
      ),
    ).not.toBeInTheDocument();
    expect(
      queryByText(
        'Veuillez choisir au moins un compte autorisé pour pouvoir enregistrer vos réglages.',
      ),
    ).not.toBeInTheDocument();
  });

  it('should call SimpleButton with params, can not submit', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // When
    renderWithFinalForm(
      <UserPreferencesFormComponent
        submitWithSuccess={false}
        userPreferences={userPreferencesMock}
      />,
    );

    // Then
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      expect.objectContaining({
        children: 'Enregistrer mes réglages',
        disabled: true,
        type: 'submit',
      }),
      undefined,
    );
  });

  it('should call SimpleButton with params, can submit', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest.mocked(useFormState).mockReturnValue({ ...useFormStateMock, pristine: false });

    // When
    renderWithFinalForm(
      <UserPreferencesFormComponent
        submitWithSuccess={false}
        userPreferences={userPreferencesMock}
      />,
    );

    // Then
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      expect.objectContaining({
        children: 'Enregistrer mes réglages',
        disabled: false,
        type: 'submit',
      }),
      undefined,
    );
  });

  it('should show a notification when the form has been submitted', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest.mocked(useFormState).mockReturnValue({ ...useFormStateMock, dirty: false });

    // When
    const { getByText } = renderWithFinalForm(
      <UserPreferencesFormComponent submitWithSuccess userPreferences={userPreferencesMock} />,
    );
    const element = getByText(
      'Une notification récapitulant les modifications va vous être envoyée',
    );

    // Then
    expect(element).toBeInTheDocument();
  });
});

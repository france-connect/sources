import { fireEvent, render } from '@testing-library/react';

import { AlertComponent, SimpleButton, ToggleInput } from '@fc/dsfr';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

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

  beforeEach(() => {
    // Given
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(String)]);
  });

  it('should match the snapshot, display into a desktop viewport', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);

    // When
    const { container } = render(
      <UserPreferencesFormComponent
        isDisabled
        dirtyFields={{}}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);

    // When
    const { container } = render(
      <UserPreferencesFormComponent
        isDisabled
        dirtyFields={{}}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a desktop viewport when form validation button is not disabled', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);

    // When
    const { container } = render(
      <UserPreferencesFormComponent
        dirtyFields={{}}
        hasValidationErrors={false}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport when form validation button is not disabled', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);

    // When
    const { container } = render(
      <UserPreferencesFormComponent
        dirtyFields={{}}
        hasValidationErrors={false}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a desktop viewport when the form has errors', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);

    // When
    const { container } = render(
      <UserPreferencesFormComponent
        hasValidationErrors
        dirtyFields={{}}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport when the form has errors', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);

    // When
    const { container } = render(
      <UserPreferencesFormComponent
        hasValidationErrors
        dirtyFields={{}}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call ServicesListComponent with params', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // When
    render(
      <UserPreferencesFormComponent
        isDisabled
        dirtyFields={{}}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );

    // Then
    expect(ServicesListComponent).toHaveBeenCalledOnce();
    expect(ServicesListComponent).toHaveBeenCalledWith(
      { identityProviders: userPreferencesMock.idpList },
      {},
    );
  });

  it('should call ToggleInput with params', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // When
    render(
      <UserPreferencesFormComponent
        isDisabled
        dirtyFields={{}}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
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
      {},
    );
  });

  it('should render AllowFutureIdpSwitchLabelComponent with params, when labelCallback is called', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    const toggleInputValue = false;
    jest
      .mocked(ToggleInput)
      .mockImplementationOnce(({ label }) => <div>{(label as Function)(toggleInputValue)}</div>);
    // When
    render(
      <UserPreferencesFormComponent
        isDisabled
        dirtyFields={{}}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );

    // Then
    expect(AllowFutureIdpSwitchLabelComponent).toHaveBeenCalledOnce();
    expect(AllowFutureIdpSwitchLabelComponent).toHaveBeenCalledWith(
      { checked: toggleInputValue },
      {},
    );
  });

  it('should call AlertComponent with params when the form has errors', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    jest
      .mocked(AlertComponent)
      .mockImplementationOnce(({ children }) => <div data-mockid="AlertComponent">{children}</div>);

    // When
    const { container, getByText } = render(
      <UserPreferencesFormComponent
        hasValidationErrors
        dirtyFields={{}}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
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
      {},
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

    // When
    const { getByTestId } = render(
      <UserPreferencesFormComponent
        dirtyFields={{}}
        hasValidationErrors={false}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
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

    // When
    const { container, queryByText } = render(
      <UserPreferencesFormComponent
        dirtyFields={{}}
        hasValidationErrors={false}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(AlertComponent).toHaveBeenCalledTimes(0);
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
    render(
      <UserPreferencesFormComponent
        isDisabled
        dirtyFields={{}}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
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
      {},
    );
  });

  it('should call SimpleButton with params, can submit', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // When
    render(
      <UserPreferencesFormComponent
        dirtyFields={{}}
        hasValidationErrors={false}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
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
      {},
    );
  });

  it('should show a notification when the form has been submitted', () => {
    // Given
    jest.mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // When
    const { getByText } = render(
      <UserPreferencesFormComponent
        isDisabled
        showNotification
        dirtyFields={{}}
        hasValidationErrors={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    const element = getByText(
      'Une notification récapitulant les modifications va vous être envoyée',
    );

    // Then
    expect(element).toBeInTheDocument();
  });
});

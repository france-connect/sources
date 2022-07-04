import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { AlertMessageComponent, AlertTypes, CheckboxInput, SimpleButton, Sizes } from '@fc/dsfr';

import { ServicesListComponent } from './services-list.component';
import { UserPreferencesFormComponent } from './user-preferences-form.component';

jest.mock('@fc/dsfr');
jest.mock('../hooks');
jest.mock('./services-list.component');

describe('UserPreferencesFormComponent', () => {
  // given
  const userPreferencesMock = {
    allowFutureIdp: false,
    idpList: [expect.any(Object), expect.any(Object)],
  };
  const errorMock = {
    closable: false,
    description: 'error description',
    size: Sizes.MEDIUM,
    title: 'error title',
    type: AlertTypes.ERROR,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot, display into a desktop viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { container } = render(
      <UserPreferencesFormComponent
        isDisabled
        errors={undefined}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(
      <UserPreferencesFormComponent
        isDisabled
        errors={undefined}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a desktop viewport when form validation button is not disabled', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { container } = render(
      <UserPreferencesFormComponent
        errors={undefined}
        hasValidationErrors={false}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport when form validation button is not disabled', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(
      <UserPreferencesFormComponent
        errors={undefined}
        hasValidationErrors={false}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a desktop viewport when the form has errors', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { container } = render(
      <UserPreferencesFormComponent
        hasValidationErrors
        errors={errorMock}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport when the form has errors', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(
      <UserPreferencesFormComponent
        hasValidationErrors
        errors={errorMock}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should call ServicesListComponent with params', () => {
    // when
    render(
      <UserPreferencesFormComponent
        isDisabled
        errors={undefined}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(ServicesListComponent).toHaveBeenCalledTimes(1);
    expect(ServicesListComponent).toHaveBeenCalledWith(
      { identityProviders: userPreferencesMock.idpList },
      {},
    );
  });

  it('should not call ServicesListComponent when idpList is empty', () => {
    // when
    render(
      <UserPreferencesFormComponent
        isDisabled
        errors={undefined}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={{ allowFutureIdp: false, idpList: [] }}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(ServicesListComponent).not.toHaveBeenCalled();
  });

  it('should not call ServicesListComponent when userPreferences.idpList is not defined', () => {
    // when
    render(
      <UserPreferencesFormComponent
        isDisabled
        errors={undefined}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={{ allowFutureIdp: false, idpList: undefined }}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(ServicesListComponent).not.toHaveBeenCalled();
  });

  it('should not call ServicesListComponent when userPreferences is not defined', () => {
    // when
    render(
      <UserPreferencesFormComponent
        isDisabled
        errors={undefined}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={undefined}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(ServicesListComponent).not.toHaveBeenCalled();
  });

  it('should call CheckboxInput with params', () => {
    // when
    render(
      <UserPreferencesFormComponent
        isDisabled
        errors={undefined}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(CheckboxInput).toHaveBeenCalledTimes(1);
    expect(CheckboxInput).toHaveBeenCalledWith(
      {
        label: 'Bloquer par défaut les nouveaux moyens de connexion dans FranceConnect',
        name: 'allowFutureIdp',
      },
      {},
    );
  });

  it('should call AlertMessageComponent with params', () => {
    // when
    render(
      <UserPreferencesFormComponent
        hasValidationErrors
        errors={errorMock}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(AlertMessageComponent).toHaveBeenCalledTimes(1);
    expect(AlertMessageComponent).toHaveBeenCalledWith(
      {
        closable: false,
        description: 'error description',
        size: Sizes.MEDIUM,
        title: 'error title',
        type: AlertTypes.ERROR,
      },
      {},
    );
  });

  it('should not call AlertMessageComponent if there are no errors', () => {
    // when
    render(
      <UserPreferencesFormComponent
        errors={undefined}
        hasValidationErrors={false}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(AlertMessageComponent).toHaveBeenCalledTimes(0);
  });

  it('should call AlertMessageComponent with undefined params', () => {
    // when
    render(
      <UserPreferencesFormComponent
        hasValidationErrors
        errors={undefined}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(AlertMessageComponent).toHaveBeenCalledTimes(1);
    expect(AlertMessageComponent).toHaveBeenCalledWith(
      {
        closable: undefined,
        description: undefined,
        size: undefined,
        title: undefined,
      },
      {},
    );
  });

  it('should call SimpleButton with params, can not submit', () => {
    // when
    render(
      <UserPreferencesFormComponent
        isDisabled
        errors={undefined}
        hasValidationErrors={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(SimpleButton).toHaveBeenCalledTimes(1);
    expect(SimpleButton).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        label: 'Enregistrer mes réglages',
        type: 'submit',
      }),
      {},
    );
  });

  it('should call SimpleButton with params, can submit', () => {
    // when
    render(
      <UserPreferencesFormComponent
        errors={undefined}
        hasValidationErrors={false}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(SimpleButton).toHaveBeenCalledTimes(1);
    expect(SimpleButton).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: false,
        label: 'Enregistrer mes réglages',
        type: 'submit',
      }),
      {},
    );
  });

  it('should show a notification when the form has been submitted', () => {
    // when
    const { getByText } = render(
      <UserPreferencesFormComponent
        isDisabled
        showNotification
        errors={undefined}
        hasValidationErrors={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    const element = getByText(
      'Une notification récapitulant les modifications va vous être envoyée',
    );
    // then
    expect(element).toBeInTheDocument();
  });
});

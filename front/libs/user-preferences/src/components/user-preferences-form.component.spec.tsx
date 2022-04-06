import { render } from '@testing-library/react';

import { ButtonSimpleComponent, FieldCheckboxComponent } from '@fc/backoffice';

import { ServicesListComponent } from './services-list.component';
import { UserPreferencesFormComponent } from './user-preferences-form.component';

jest.mock('../hooks');
jest.mock('./services-list.component');

describe('UserPreferencesFormComponent', () => {
  // given
  const userPreferencesMock = {
    allowFutureIdp: false,
    idpList: [expect.any(Object), expect.any(Object)],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call ServicesListComponent with params', () => {
    // when
    render(
      <UserPreferencesFormComponent
        canNotSubmit
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
        canNotSubmit
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
        canNotSubmit
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
        canNotSubmit
        showNotification={false}
        userPreferences={undefined}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(ServicesListComponent).not.toHaveBeenCalled();
  });

  it('should call FieldCheckboxComponent with params', () => {
    // when
    render(
      <UserPreferencesFormComponent
        canNotSubmit
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(FieldCheckboxComponent).toHaveBeenCalledTimes(1);
    expect(FieldCheckboxComponent).toHaveBeenCalledWith(
      {
        className: 'is-bold mt20',
        label: 'Bloquer par défaut les nouveaux moyens de connexion dans FranceConnect',
        name: 'allowFutureIdp',
      },
      {},
    );
  });

  it('should call ButtonSimpleComponent with params, can not submit', () => {
    // when
    render(
      <UserPreferencesFormComponent
        canNotSubmit
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(ButtonSimpleComponent).toHaveBeenCalledTimes(1);
    expect(ButtonSimpleComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'py12 px32',
        disabled: true,
        label: 'Enregistrer mes réglages',
        type: 'submit',
      }),
      {},
    );
  });

  it('should call ButtonSimpleComponent with params, can submit', () => {
    // when
    render(
      <UserPreferencesFormComponent
        canNotSubmit={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );
    // then
    expect(ButtonSimpleComponent).toHaveBeenCalledTimes(1);
    expect(ButtonSimpleComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'py12 px32',
        disabled: false,
        label: 'Enregistrer mes réglages',
        type: 'submit',
      }),
      {},
    );
  });

  it('should send a notification when user submit form', () => {
    // when
    const { getByText } = render(
      <UserPreferencesFormComponent
        canNotSubmit
        showNotification
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

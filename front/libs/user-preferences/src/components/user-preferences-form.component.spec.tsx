import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { CheckboxInput, SimpleButton } from '@fc/dsfr';

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

  it('should match the snapshot, display into a desktop viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { container } = render(
      <UserPreferencesFormComponent
        isDisabled
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

  it('should call SimpleButton with params, can not submit', () => {
    // when
    render(
      <UserPreferencesFormComponent
        isDisabled
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

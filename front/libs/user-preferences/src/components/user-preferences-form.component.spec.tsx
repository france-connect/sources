import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { AlertComponent, SimpleButton, ToggleInput } from '@fc/dsfr';

import { useUserPreferencesForm } from '../hooks';
import { AllowFutureIdpSwitchLabelComponent } from './allow-future-idp-switch-label.component';
import { ServicesListComponent } from './services-list.component';
import { UserPreferencesFormComponent } from './user-preferences-form.component';

jest.mock('@fc/dsfr');
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
    jest.clearAllMocks();
  });

  it('should match the snapshot, display into a desktop viewport', () => {
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    mocked(useMediaQuery).mockReturnValueOnce(true);

    // when
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

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport', () => {
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    mocked(useMediaQuery).mockReturnValueOnce(false);

    // when
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

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a desktop viewport when form validation button is not disabled', () => {
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    mocked(useMediaQuery).mockReturnValueOnce(true);

    // when
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

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport when form validation button is not disabled', () => {
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    mocked(useMediaQuery).mockReturnValueOnce(false);

    // when
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

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a desktop viewport when the form has errors', () => {
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    mocked(useMediaQuery).mockReturnValueOnce(true);

    // when
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

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, display into a mobile viewport when the form has errors', () => {
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    mocked(useMediaQuery).mockReturnValueOnce(false);

    // when
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

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call ServicesListComponent with params', () => {
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // when
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

    // then
    expect(ServicesListComponent).toHaveBeenCalledTimes(1);
    expect(ServicesListComponent).toHaveBeenCalledWith(
      { identityProviders: userPreferencesMock.idpList },
      {},
    );
  });

  it('should call ToggleInput with params', () => {
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // when
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

    // then
    expect(ToggleInput).toHaveBeenCalledTimes(1);
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
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    const useCallbackMock = jest.spyOn(React, 'useCallback');

    // when
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

    act(() => {
      const callback = useCallbackMock.mock.calls[0][0];
      ReactDOM.render(<div>{callback(false)}</div>, container);
    });

    // then
    expect(AllowFutureIdpSwitchLabelComponent).toHaveBeenCalledTimes(1);
    expect(AllowFutureIdpSwitchLabelComponent).toHaveBeenCalledWith({ checked: false }, {});
  });

  it('should call AlertComponent with params when the form has errors', () => {
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);
    const expectedProps = {
      children: expect.any(Array),
      type: 'error',
    };

    // when
    render(
      <UserPreferencesFormComponent
        hasValidationErrors
        dirtyFields={{}}
        isDisabled={false}
        showNotification={false}
        userPreferences={userPreferencesMock}
        onSubmit={jest.fn()}
      />,
    );

    // then
    expect(AlertComponent).toHaveBeenCalledTimes(1);
    expect(AlertComponent).toHaveBeenCalledWith(expectedProps, {});
  });

  it('should call useUserPreferencesForm with dirtyFields and userPreference when allowingIdPConfirmation is called', () => {
    // given
    mocked(AlertComponent).mockImplementationOnce(({ children }) => <div>{children}</div>);
    mocked(useUserPreferencesForm).mockReturnValue({
      alertInfoState: {
        hasInteractedWithAlertInfo: false,
        isDisplayedAlertInfo: true,
      },
      allowingIdPConfirmation: jest.fn(),
    });
    const expectedArgs = {
      dirtyFields: {},
      userPreferences: userPreferencesMock,
    };

    // when
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

    // then
    expect(useUserPreferencesForm).toHaveBeenCalledTimes(1);
    expect(useUserPreferencesForm).toHaveBeenCalledWith(expectedArgs);
  });

  it('should not call AlertComponent if there are no errors', () => {
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // when
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

    // then
    expect(AlertComponent).toHaveBeenCalledTimes(0);
  });

  it('should call SimpleButton with params, can not submit', () => {
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // when
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
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // when
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
    // given
    mocked(useUserPreferencesForm).mockReturnValueOnce(hookResultMock);

    // when
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

    // then
    expect(element).toBeInTheDocument();
  });
});

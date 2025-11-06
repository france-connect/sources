import { render } from '@testing-library/react';
import { Field, Form } from 'react-final-form';

import { TextAreaInputComponent, TextInputComponent } from '@fc/core-user-dashboard';
import { ButtonTypes, CheckboxInput, SimpleButton, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { FraudFormComponent } from './fraud-form.component';
import {
  inputAuthenticationEventIdConfig,
  inputEmailConfig,
  inputPhoneConfig,
  inputTextAreaDescriptionConfig,
} from './fraud-form-input.config';

describe('FraudFormComponent', () => {
  const commitMock = jest.fn();
  const fraudSurveyOrigin = 'mock-origin';
  const idpEmail = 'email@idp.com';

  beforeEach(() => {
    // Given
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(String)]);
    jest
      .mocked(t)
      .mockReturnValueOnce('any-form-title-mock')
      .mockReturnValueOnce('any-form-mention-mock')
      .mockReturnValueOnce('any-form-accept-mock')
      .mockReturnValueOnce('any-form-report-mock');
  });

  it('should call t 2 times with correct params', () => {
    // When
    render(
      <FraudFormComponent
        commit={commitMock}
        fraudSurveyOrigin={fraudSurveyOrigin}
        idpEmail={idpEmail}
      />,
    );

    // Then
    expect(t).toHaveBeenCalledTimes(4);
    expect(t).toHaveBeenNthCalledWith(1, 'FraudForm.form.title');
    expect(t).toHaveBeenNthCalledWith(2, 'FraudForm.form.mention');
    expect(t).toHaveBeenNthCalledWith(3, 'FraudForm.form.accept');
    expect(t).toHaveBeenNthCalledWith(4, 'FraudForm.form.report');
  });

  it('should match the snapshot on mobile layout', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(false);

    // When
    const { container } = render(
      <FraudFormComponent
        commit={commitMock}
        fraudSurveyOrigin={fraudSurveyOrigin}
        idpEmail={idpEmail}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on desktop layout', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(true);

    // When
    const { container } = render(
      <FraudFormComponent
        commit={commitMock}
        fraudSurveyOrigin={fraudSurveyOrigin}
        idpEmail={idpEmail}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call Form with initialValues', () => {
    // When
    render(
      <FraudFormComponent
        commit={commitMock}
        fraudSurveyOrigin={fraudSurveyOrigin}
        idpEmail={idpEmail}
      />,
    );

    // Then
    expect(Form).toHaveBeenCalledWith(
      {
        children: expect.any(Function),
        initialValues: {
          authenticationEventId: undefined,
          contactEmail: 'email@idp.com',
          fraudSurveyOrigin: 'mock-origin',
          idpEmail: 'email@idp.com',
          phoneNumber: undefined,
        },
        onSubmit: commitMock,
      },
      undefined,
    );
  });

  it('should call Field', () => {
    // When
    render(
      <FraudFormComponent
        commit={jest.fn()}
        fraudSurveyOrigin={fraudSurveyOrigin}
        idpEmail={idpEmail}
      />,
    );

    // Then
    expect(Field).toHaveBeenCalledTimes(2);
    expect(Field).toHaveBeenNthCalledWith(
      1,
      {
        component: 'input',
        name: 'fraudSurveyOrigin',
        type: 'hidden',
      },
      undefined,
    );
    expect(Field).toHaveBeenNthCalledWith(
      2,
      {
        component: 'input',
        name: 'idpEmail',
        type: 'hidden',
      },
      undefined,
    );
  });

  it('should call TextInputComponent', () => {
    // When
    render(
      <FraudFormComponent
        commit={jest.fn()}
        fraudSurveyOrigin={fraudSurveyOrigin}
        idpEmail={idpEmail}
      />,
    );

    // Then
    expect(TextInputComponent).toHaveBeenCalledTimes(3);
    expect(TextInputComponent).toHaveBeenNthCalledWith(
      1,
      inputAuthenticationEventIdConfig,
      undefined,
    );
    expect(TextInputComponent).toHaveBeenNthCalledWith(2, inputEmailConfig, undefined);
    expect(TextInputComponent).toHaveBeenNthCalledWith(3, inputPhoneConfig, undefined);
  });

  it('should call TextAreaInputComponent', () => {
    // When
    render(
      <FraudFormComponent
        commit={jest.fn()}
        fraudSurveyOrigin={fraudSurveyOrigin}
        idpEmail={idpEmail}
      />,
    );

    // Then
    expect(TextAreaInputComponent).toHaveBeenCalledOnce();
    expect(TextAreaInputComponent).toHaveBeenCalledWith(inputTextAreaDescriptionConfig, undefined);
  });

  it('should call CheckboxInput', () => {
    // When
    render(
      <FraudFormComponent
        commit={jest.fn()}
        fraudSurveyOrigin={fraudSurveyOrigin}
        idpEmail={idpEmail}
      />,
    );

    // Then
    expect(CheckboxInput).toHaveBeenCalledOnce();
    expect(CheckboxInput).toHaveBeenCalledWith(
      {
        label: 'any-form-accept-mock',
        name: 'acceptTransmitData',
      },
      undefined,
    );
  });

  it('should call SimpleButton', () => {
    // When
    render(
      <FraudFormComponent
        commit={jest.fn()}
        fraudSurveyOrigin={fraudSurveyOrigin}
        idpEmail={idpEmail}
      />,
    );

    // Then
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      {
        children: 'any-form-report-mock',
        className: 'fr-mt-4w',
        dataTestId: 'fraud-form-submit-button',
        disabled: expect.any(Boolean),
        size: Sizes.MEDIUM,
        type: ButtonTypes.SUBMIT,
      },
      undefined,
    );
  });
});

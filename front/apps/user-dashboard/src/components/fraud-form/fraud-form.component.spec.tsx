import { render } from '@testing-library/react';
import { Field, Form } from 'react-final-form';

import { ButtonTypes, CheckboxInput, SimpleButton, Sizes } from '@fc/dsfr';
import { useStylesQuery, useStylesVariables } from '@fc/styles';
import { TextAreaInputComponent, TextInputComponent } from '@fc/user-dashboard';

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
      {},
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
      {},
    );
    expect(Field).toHaveBeenNthCalledWith(
      2,
      {
        component: 'input',
        name: 'idpEmail',
        type: 'hidden',
      },
      {},
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
    expect(TextInputComponent).toHaveBeenNthCalledWith(1, inputAuthenticationEventIdConfig, {});
    expect(TextInputComponent).toHaveBeenNthCalledWith(2, inputEmailConfig, {});
    expect(TextInputComponent).toHaveBeenNthCalledWith(3, inputPhoneConfig, {});
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
    expect(TextAreaInputComponent).toHaveBeenCalledWith(inputTextAreaDescriptionConfig, {});
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
        label:
          'Vous acceptez de transmettre ces données à FranceConnect pour traiter votre demande d’aide.*',
        name: 'acceptTransmitData',
      },
      {},
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
        children: 'Signaler',
        className: 'fr-mt-4w',
        dataTestId: 'fraud-form-submit-button',
        disabled: expect.any(Boolean),
        size: Sizes.MEDIUM,
        type: ButtonTypes.SUBMIT,
      },
      {},
    );
  });
});

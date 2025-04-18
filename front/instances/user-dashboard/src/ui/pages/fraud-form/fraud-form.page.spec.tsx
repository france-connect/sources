import { render } from '@testing-library/react';

import { AccountContext } from '@fc/account';
import { EventTypes, useSafeContext } from '@fc/common';
import { ConfigService } from '@fc/config';
import { AlertComponent, Sizes } from '@fc/dsfr';
import { useStylesQuery, useStylesVariables } from '@fc/styles';
import type { FraudConfigInterface } from '@fc/user-dashboard';
import {
  AuthenticationEventIdCallout,
  FraudFormComponent,
  FraudFormIntroductionComponent,
  FraudSurveyIntroductionComponent,
  useFraudFormApi,
  useGetFraudSurveyOrigin,
} from '@fc/user-dashboard';

import { FraudFormPage } from './fraud-form.page';

describe('FraudFormPage', () => {
  const fraudConfig: FraudConfigInterface = {
    apiRouteFraudForm: 'any-route',
    fraudSupportFormPathname: 'any-pathname',
    fraudSurveyUrl: 'fraud-survey-url',
    supportFormUrl: 'support-form-url',
    surveyOriginQueryParam: 'any-param',
  };

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue(fraudConfig);
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(String)]);
    jest.mocked(useGetFraudSurveyOrigin).mockReturnValue('mock-origin');
    jest.mocked(useFraudFormApi).mockReturnValue({
      commit: jest.fn(),
      submitErrors: undefined,
      submitWithSuccess: false,
    });
    jest.mocked(useSafeContext).mockReturnValue({ userinfos: { email: 'email@fi.com' } });
  });

  it('should match the snapshot on desktop layout with fraud form,', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(false);

    // When
    const { container } = render(<FraudFormPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on mobile layout with fraud form,', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(true);

    // When
    const { container } = render(<FraudFormPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on desktop layout without fraud form,', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(false);
    jest.mocked(useGetFraudSurveyOrigin).mockReturnValueOnce('');

    // When
    const { container } = render(<FraudFormPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on mobile layout without fraud form,', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(true);
    jest.mocked(useGetFraudSurveyOrigin).mockReturnValueOnce('');

    // When
    const { container } = render(<FraudFormPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on desktop layout, when form submission has succeeded', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(false);
    jest.mocked(useFraudFormApi).mockReturnValueOnce({
      commit: jest.fn(),
      submitErrors: undefined,
      submitWithSuccess: true,
    });

    // When
    const { container } = render(<FraudFormPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on mobile layout, when form submission has failed', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(true);
    jest.mocked(useFraudFormApi).mockReturnValueOnce({
      commit: jest.fn(),
      submitErrors: new Error('any-error'),
      submitWithSuccess: false,
    });

    // When
    const { container } = render(<FraudFormPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on desktop layout, when form submission has failed', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(false);
    jest.mocked(useFraudFormApi).mockReturnValueOnce({
      commit: jest.fn(),
      submitErrors: new Error('any-error'),
      submitWithSuccess: false,
    });

    // When
    const { container } = render(<FraudFormPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on mobile layout, when form submission has succeeded', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(true);
    jest.mocked(useFraudFormApi).mockReturnValueOnce({
      commit: jest.fn(),
      submitErrors: undefined,
      submitWithSuccess: true,
    });

    // When
    const { container } = render(<FraudFormPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should have called FraudFormIntroductionComponent when fraud form is displayed', () => {
    // When
    render(<FraudFormPage />);

    // Then
    expect(FraudFormIntroductionComponent).toHaveBeenCalled();
  });

  it('should have called FraudFormComponent', () => {
    // When
    render(<FraudFormPage />);

    // Then
    expect(FraudFormComponent).toHaveBeenCalled();
  });

  it('should have called SessionIdCallout', () => {
    // When
    render(<FraudFormPage />);

    // Then
    expect(AuthenticationEventIdCallout).toHaveBeenCalled();
  });

  it('should have called FraudSurveyIntroductionComponent when fraud form is not displayed', () => {
    // Given
    jest.mocked(useGetFraudSurveyOrigin).mockReturnValueOnce('');

    // When
    render(<FraudFormPage />);

    // Then
    expect(FraudSurveyIntroductionComponent).toHaveBeenCalled();
  });

  it('should have not called FraudFormComponent', () => {
    // Given
    jest.mocked(useGetFraudSurveyOrigin).mockReturnValueOnce('');

    // When
    render(<FraudFormPage />);

    // Then
    expect(FraudFormComponent).not.toHaveBeenCalled();
  });

  it('should have not called SessionIdCallout', () => {
    // Given
    jest.mocked(useGetFraudSurveyOrigin).mockReturnValueOnce('');

    // When
    render(<FraudFormPage />);

    // Then
    expect(AuthenticationEventIdCallout).not.toHaveBeenCalled();
  });

  it('should have called useGetFraudSurveyOrigin hook', () => {
    // When
    render(<FraudFormPage />);

    // Then
    expect(useGetFraudSurveyOrigin).toHaveBeenCalledOnce();
    expect(useGetFraudSurveyOrigin).toHaveBeenCalledWith(fraudConfig);
  });

  it('should have called useSafeContext with AccountContext as parameter', () => {
    // When
    render(<FraudFormPage />);

    // Then
    expect(useSafeContext).toHaveBeenCalledWith(AccountContext);
  });

  it('should have called useFraudFormApi hook', () => {
    // When
    render(<FraudFormPage />);

    // Then
    expect(useFraudFormApi).toHaveBeenCalledOnce();
    expect(useFraudFormApi).toHaveBeenCalledWith(fraudConfig);
  });

  it('should have called AlertComponent when fraudSurveyOrigin is a string and submitted with success', () => {
    // Given
    jest.mocked(useGetFraudSurveyOrigin).mockReturnValueOnce('any-string-mock');
    jest.mocked(useFraudFormApi).mockReturnValueOnce({
      commit: jest.fn(),
      submitErrors: undefined,
      submitWithSuccess: true,
    });

    // When
    const { getByText } = render(<FraudFormPage />);
    const textElt1 = getByText('Votre demande a bien été prise en compte');
    const textElt2 = getByText(
      'Vous allez recevoir un message de confirmation à l’adresse électronique indiquée dans le formulaire de contact.',
    );

    // Then
    expect(textElt1).toBeInTheDocument();
    expect(textElt2).toBeInTheDocument();
    expect(AlertComponent).toHaveBeenCalledOnce();
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Array),
        dataTestId: 'success-alert',
        type: EventTypes.SUCCESS,
      },
      {},
    );
  });

  it('should have called AlertComponent when fraudSurveyOrigin is a string and submitted with error', () => {
    // Given
    jest.mocked(useGetFraudSurveyOrigin).mockReturnValueOnce('any-string-mock');
    jest.mocked(useFraudFormApi).mockReturnValueOnce({
      commit: jest.fn(),
      submitErrors: new Error('any-error-mock'),
      submitWithSuccess: false,
    });

    // When
    const { getByText } = render(<FraudFormPage />);
    const textElt = getByText('Le message n’a pas pu être envoyé');

    // Then
    expect(textElt).toBeInTheDocument();
    expect(AlertComponent).toHaveBeenCalledOnce();
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        size: Sizes.SMALL,
        type: EventTypes.ERROR,
      },
      {},
    );
  });
});

import { render } from '@testing-library/react';

import { AccountContext } from '@fc/account';
import { MessageTypes, useSafeContext } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { FraudConfigInterface } from '@fc/core-user-dashboard';
import {
  AuthenticationEventIdCallout,
  FraudFormComponent,
  FraudFormIntroductionComponent,
  FraudSurveyIntroductionComponent,
  useFraudFormApi,
  useGetFraudSurveyOrigin,
} from '@fc/core-user-dashboard';
import { AlertComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { FraudFormPage } from './fraud-form.page';

describe('FraudFormPage', () => {
  const fraudConfigMock = Symbol('any-fraudConfig-mock') as unknown as FraudConfigInterface;

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue(fraudConfigMock);
    jest.mocked(useStylesVariables).mockReturnValue([expect.any(String)]);
    jest.mocked(useGetFraudSurveyOrigin).mockReturnValue('mock-origin');
    jest.mocked(useFraudFormApi).mockReturnValue({
      commit: jest.fn(),
      submitErrors: undefined,
      submitWithSuccess: false,
    });
    jest.mocked(useSafeContext).mockReturnValue({ userinfos: { email: 'email@fi.com' } });
    jest
      .mocked(t)
      .mockReturnValueOnce('any-document-title-mock')
      .mockReturnValueOnce('any-success-mock')
      .mockReturnValueOnce('any-confirmation-mock')
      .mockReturnValueOnce('any-error-mock');
  });

  it('should match the snapshot on desktop layout with fraud form', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(false);

    // When
    const { container } = render(<FraudFormPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call t 4 times with correct params', () => {
    // When
    render(<FraudFormPage />);

    // Then
    expect(t).toHaveBeenCalledTimes(4);
    expect(t).toHaveBeenNthCalledWith(1, 'Fraud.formPage.documentTitle');
    expect(t).toHaveBeenNthCalledWith(2, 'Fraud.formPage.success');
    expect(t).toHaveBeenNthCalledWith(3, 'Fraud.formPage.confirmation');
    expect(t).toHaveBeenNthCalledWith(4, 'Fraud.formPage.error');
  });

  it('should match the snapshot on mobile layout with fraud form', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(true);

    // When
    const { container } = render(<FraudFormPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on desktop layout without fraud form', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(false);
    jest.mocked(useGetFraudSurveyOrigin).mockReturnValueOnce('');

    // When
    const { container } = render(<FraudFormPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot on mobile layout without fraud form', () => {
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
    expect(useGetFraudSurveyOrigin).toHaveBeenCalledWith(fraudConfigMock);
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
    expect(useFraudFormApi).toHaveBeenCalledWith(fraudConfigMock);
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
    const textElt1 = getByText('any-success-mock');
    const textElt2 = getByText('any-confirmation-mock');

    // Then
    expect(textElt1).toBeInTheDocument();
    expect(textElt2).toBeInTheDocument();
    expect(AlertComponent).toHaveBeenCalledOnce();
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Array),
        dataTestId: 'success-alert',
        type: MessageTypes.SUCCESS,
      },
      undefined,
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
    const textElt = getByText('any-error-mock');

    // Then
    expect(textElt).toBeInTheDocument();
    expect(AlertComponent).toHaveBeenCalledOnce();
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        size: Sizes.SMALL,
        type: MessageTypes.ERROR,
      },
      undefined,
    );
  });
});

import { render } from '@testing-library/react';

import { MessageTypes } from '@fc/common';
import { AccordionComponent, AlertComponent, LinkComponent, Sizes } from '@fc/dsfr';
import { LoginFormComponent } from '@fc/login-form';

import { useFraudLoginPage } from '../../../../hooks';
import { LoginLayout } from '../../../layouts';
import { FraudLoginPage } from './fraud-login.page';

jest.mock('../../../layouts/login/login.layout');
jest.mock('../../../../hooks/fraud-login-page/fraud-login-page.hook');

describe('FraudLoginPage', () => {
  // Given
  const toggleFuncMock = jest.fn();
  const toggleValueMock = Symbol('toggleValueMock') as unknown as boolean;

  beforeEach(() => {
    // Given
    jest.mocked(useFraudLoginPage).mockReturnValue({
      expanded: toggleValueMock,
      identityTheftReportRoute: 'any-fraud-support-form-url',
      search: '?param=value',
      toggleExpanded: toggleFuncMock,
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<FraudLoginPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useFraudLoginPage', () => {
    // When
    render(<FraudLoginPage />);

    // Then
    expect(useFraudLoginPage).toHaveBeenCalledExactlyOnceWith();
  });

  it('should call login layout', () => {
    // Given
    render(<FraudLoginPage />);

    // Then
    expect(LoginLayout).toHaveBeenCalledExactlyOnceWith(
      {
        children: expect.any(Object),
        documentTitle: 'Fraud.loginPage.documentTitle',
        size: Sizes.SMALL,
      },
      undefined,
    );
  });

  it('should render the main heading', () => {
    // Given
    const { getByText } = render(<FraudLoginPage />);
    const titleElt = getByText('Fraud.loginPage.title');

    // Then
    expect(titleElt).toBeInTheDocument();
  });

  it('should call AlertComponent with params', () => {
    // Given
    const { getByText } = render(<FraudLoginPage />);
    const textElt = getByText('Fraud.loginPage.alertInfo');

    // Then
    expect(textElt).toBeInTheDocument();
    expect(AlertComponent).toHaveBeenCalledExactlyOnceWith(
      {
        children: expect.any(Object),
        className: 'fr-my-3w',
        dataTestId: 'AlertComponent-fraud-login-info',
        icon: 'fr-icon-lightbulb-fill',
        size: Sizes.MEDIUM,
        type: MessageTypes.INFO,
      },
      undefined,
    );
  });

  it('should render the sub heading', () => {
    // Given
    const { getByText } = render(<FraudLoginPage />);
    const subTitleElt = getByText('Fraud.loginPage.subtitle');

    // Then
    expect(subTitleElt).toBeInTheDocument();
  });

  it('should render the paragraph', () => {
    // Given
    const { getByText } = render(<FraudLoginPage />);
    const paragraphElt = getByText('Fraud.loginPage.textLead');

    // Then
    expect(paragraphElt).toBeInTheDocument();
  });

  it('should render LoginFormComponent without redirectUrl', () => {
    // When
    render(<FraudLoginPage />);

    // Then
    expect(LoginFormComponent).toHaveBeenCalledOnce();
    expect(LoginFormComponent).toHaveBeenCalledWith(
      {
        className: 'flex-rows items-center',
        connectType: 'FranceConnect',
        redirectUrl: '/fraud/form?param=value',
        showHelp: true,
      },
      undefined,
    );
  });

  it('should render LoginFormComponent with redirectUrl', () => {
    // When
    render(<FraudLoginPage />);

    // Then
    expect(LoginFormComponent).toHaveBeenCalledOnce();
    expect(LoginFormComponent).toHaveBeenCalledWith(
      {
        className: 'flex-rows items-center',
        connectType: 'FranceConnect',
        redirectUrl: '/fraud/form?param=value',
        showHelp: true,
      },
      undefined,
    );
  });

  it('should render AccordionComponent with params', () => {
    // When
    render(<FraudLoginPage />);

    // Then
    expect(AccordionComponent).toHaveBeenCalledExactlyOnceWith(
      {
        children: expect.any(Object),
        id: 'fraud-login-accordion',
        onClick: toggleFuncMock,
        opened: toggleValueMock,
        title: 'Fraud.loginPage.accordion.title',
      },
      undefined,
    );
  });

  it('should render AccordionComponent text content', () => {
    // When
    const { getByText } = render(<FraudLoginPage />);
    const textElt1 = getByText('Fraud.loginPage.accordion.paragraph1');
    const textElt2 = getByText('Fraud.loginPage.accordion.paragraph2');

    // Then
    expect(textElt1).toBeInTheDocument();
    expect(textElt2).toBeInTheDocument();
  });

  it('should render LinkComponent with params', () => {
    // When
    render(<FraudLoginPage />);

    // Then
    expect(LinkComponent).toHaveBeenCalledExactlyOnceWith(
      {
        dataTestId: 'fraud-identity-theft-report-link',
        href: 'any-fraud-support-form-url',
        label: 'Fraud.loginPage.accordion.reportForm',
      },
      undefined,
    );
  });
});

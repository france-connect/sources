import { render } from '@testing-library/react';
import { useLocation } from 'react-router';

import { Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { LoginFormComponent } from '@fc/login-form';

import { LoginLayout } from '../../layouts';
import { HomePage } from './home.page';

jest.mock('../../layouts/login/login.layout');

describe('HomePage', () => {
  beforeEach(() => {
    // Given
    jest
      .mocked(t)
      .mockReturnValueOnce('UserDashboard-homepage-documentTitle--mock')
      .mockReturnValueOnce('UserDashboard-homepage-title--mock')
      .mockReturnValueOnce('UserDashboard-homepage-paragraph--mock');
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<HomePage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call the translation function 3 times', () => {
    // When
    render(<HomePage />);

    // Then
    expect(t).toHaveBeenCalledTimes(3);
    expect(t).toHaveBeenNthCalledWith(1, 'UserDashboard.homepage.documentTitle');
    expect(t).toHaveBeenNthCalledWith(2, 'UserDashboard.homepage.title');
    expect(t).toHaveBeenNthCalledWith(3, 'UserDashboard.homepage.paragraph');
  });

  it('should have called useLocation hook', () => {
    // When
    render(<HomePage />);

    // Then
    expect(useLocation).toHaveBeenCalled();
  });

  it('should call login layout', () => {
    // Given
    render(<HomePage />);

    // Then
    expect(LoginLayout).toHaveBeenCalledExactlyOnceWith(
      {
        children: expect.any(Object),
        documentTitle: 'UserDashboard-homepage-documentTitle--mock',
        size: Sizes.MEDIUM,
      },
      undefined,
    );
  });

  it('should render the main heading', () => {
    // When
    const { getByRole } = render(<HomePage />);
    const element = getByRole('heading');

    // Then
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('UserDashboard-homepage-title--mock');
  });

  it('should render the paragraph', () => {
    // When
    const { getByTestId } = render(<HomePage />);
    const element = getByTestId('paragraph');

    // Then
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('UserDashboard-homepage-paragraph--mock');
  });

  it('should render LoginFormComponent without redirectUrl', () => {
    // When
    render(<HomePage />);

    // Then
    expect(LoginFormComponent).toHaveBeenCalledOnce();
    expect(LoginFormComponent).toHaveBeenCalledWith(
      {
        className: 'flex-rows items-center',
        connectType: 'FranceConnect',
        redirectUrl: undefined,
      },
      undefined,
    );
  });

  it('should render LoginFormComponent with redirectUrl', () => {
    // Given
    jest.mocked(useLocation).mockReturnValueOnce({
      hash: expect.any(String),
      key: expect.any(String),
      pathname: expect.any(String),
      search: expect.any(String),
      state: { from: { pathname: '/any-pathname' } },
    });

    // When
    render(<HomePage />);

    // Then
    expect(LoginFormComponent).toHaveBeenCalledOnce();
    expect(LoginFormComponent).toHaveBeenCalledWith(
      {
        className: 'flex-rows items-center',
        connectType: 'FranceConnect',
        redirectUrl: '/any-pathname',
      },
      undefined,
    );
  });
});

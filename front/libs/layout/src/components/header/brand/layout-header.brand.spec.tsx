import { render } from '@testing-library/react';
import { Link } from 'react-router';

import { getAccessibleTitle, useSafeContext } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LogoRepubliqueFrancaiseComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { LayoutContext } from '../../../context';
import { LayoutHeaderMobileBurgerButton } from '../burger';
import { LayoutHeaderServiceComponent } from '../service/layout-header.service';
import { LayoutHeaderBrandComponent } from './layout-header.brand';

jest.mock('../service/layout-header.service');
jest.mock('../burger/layout-header.burger');

describe('LayoutHeaderBrandComponent', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      features: {
        showServiceTitle: false,
      },
      service: {
        baseline: 'any-service-baseline-mock',
        homepage: expect.any(String),
        logo: expect.any(String),
        name: 'any-service-name-mock',
      },
    });
    jest
      .mocked(getAccessibleTitle)
      .mockReturnValue('any-service-baseline-mock - any-service-name-mock')
      .mockReturnValue(
        'any-back-to-homepage-mock - any-service-baseline-mock - any-service-name-mock',
      );
    jest.mocked(useSafeContext).mockReturnValue({ isUserConnected: false });
    jest.mocked(t).mockReturnValue('any-back-to-homepage-mock');
  });

  it('should call t 1 times with params', () => {
    // When
    render(<LayoutHeaderBrandComponent />);

    // Then
    expect(t).toHaveBeenCalledExactlyOnceWith('Layout.documentTitle.backToHomepage');
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<LayoutHeaderBrandComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useSafeContext', () => {
    // When
    render(<LayoutHeaderBrandComponent />);

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(LayoutContext);
  });

  it('should call ConfigService.get with Layout config name', () => {
    // When
    render(<LayoutHeaderBrandComponent />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Layout');
  });

  it('should call getAccessibleTitle', () => {
    // Given
    jest
      .mocked(getAccessibleTitle)
      .mockReturnValueOnce(expect.any(String))
      .mockReturnValueOnce('any-service-baseline-mock - any-service-name-mock');

    // When
    render(<LayoutHeaderBrandComponent />);

    // Then
    expect(getAccessibleTitle).toHaveBeenCalledTimes(2);
    expect(getAccessibleTitle).toHaveBeenNthCalledWith(
      1,
      'any-service-baseline-mock',
      'any-service-name-mock',
    );
    expect(getAccessibleTitle).toHaveBeenNthCalledWith(
      2,
      'any-back-to-homepage-mock',
      'any-service-baseline-mock - any-service-name-mock',
    );
  });

  it('should call Link component', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      features: {
        showServiceTitle: false,
      },
      service: {
        baseline: 'any-service-baseline-mock',
        homepage: '/link-to-homepage-mock',
        logo: expect.any(String),
        name: 'any-service-name-mock',
      },
    });

    // When
    render(<LayoutHeaderBrandComponent />);

    // Then
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'any-back-to-homepage-mock - any-service-baseline-mock - any-service-name-mock',
        to: '/link-to-homepage-mock',
      }),
      undefined,
    );
  });

  it('should call LogoRepubliqueFrancaiseComponent', () => {
    // When
    render(<LayoutHeaderBrandComponent />);

    // Then
    expect(LogoRepubliqueFrancaiseComponent).toHaveBeenCalledOnce();
  });

  it('should render the logo alt text', () => {
    // When
    const { getByAltText } = render(<LayoutHeaderBrandComponent />);
    const element = getByAltText(
      'any-back-to-homepage-mock - any-service-baseline-mock - any-service-name-mock',
    );

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should call LayoutHeaderMobileBurgerButton', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValueOnce({
      isUserConnected: true,
    });

    // When
    render(<LayoutHeaderBrandComponent />);

    // Then
    expect(LayoutHeaderMobileBurgerButton).toHaveBeenCalledOnce();
    expect(LayoutHeaderMobileBurgerButton).toHaveBeenCalledWith({}, undefined);
  });

  it('should call LayoutHeaderServiceComponent', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      features: {
        showServiceTitle: true,
      },
      service: {
        baseline: expect.any(String),
        homepage: expect.any(String),
        logo: expect.any(String),
        name: expect.any(String),
      },
    });

    // When
    render(<LayoutHeaderBrandComponent />);

    // Then
    expect(LayoutHeaderServiceComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderServiceComponent).toHaveBeenCalledWith({}, undefined);
  });
});

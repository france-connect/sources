import { render } from '@testing-library/react';
import { Link } from 'react-router';

import { getAccessibleTitle } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LogoRepubliqueFrancaiseComponent } from '@fc/dsfr';

import { LayoutFooterBrandComponent } from './layout-footer.brand';

describe('LayoutFooterBrandComponent', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      service: {
        baseline: expect.any(String),
        homepage: expect.any(String),
        logo: expect.any(String),
        name: expect.any(String),
      },
    });
  });

  it('should match Snapshot', () => {
    // When
    const { container } = render(<LayoutFooterBrandComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call ConfigService.get with Layout config name', () => {
    // When
    render(<LayoutFooterBrandComponent />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Layout');
  });

  it('should call getAccessibleTitle with params', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      service: {
        baseline: 'any-service-baseline-mock',
        homepage: expect.any(String),
        name: 'any-service-name-mock',
      },
    });
    jest
      .mocked(getAccessibleTitle)
      .mockReturnValueOnce(expect.any(String))
      .mockReturnValueOnce('any-service-baseline-mock - any-service-name-mock');

    // When
    render(<LayoutFooterBrandComponent />);

    // Then
    expect(getAccessibleTitle).toHaveBeenCalledTimes(2);
    expect(getAccessibleTitle).toHaveBeenNthCalledWith(
      1,
      'any-service-baseline-mock',
      'any-service-name-mock',
    );
    expect(getAccessibleTitle).toHaveBeenNthCalledWith(
      2,
      'Retour à l’accueil du site',
      'any-service-baseline-mock - any-service-name-mock',
    );
  });

  it('should call LogoRepubliqueFrancaiseComponent', () => {
    // When
    render(<LayoutFooterBrandComponent />);

    // Then
    expect(LogoRepubliqueFrancaiseComponent).toHaveBeenCalledOnce();
  });

  it('should call Link with params', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      service: {
        baseline: 'any-service-baseline-mock',
        homepage: '/any-service-homepage-mock',
        logo: expect.any(String),
        name: 'any-service-name-mock',
      },
    });
    jest
      .mocked(getAccessibleTitle)
      .mockReturnValueOnce(expect.any(String))
      .mockReturnValueOnce(
        'Retour à l’accueil du site - any-service-baseline-mock - any-service-name-mock',
      );

    // When
    const { container } = render(<LayoutFooterBrandComponent />);

    // Then
    expect(container).toMatchSnapshot();
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'fr-footer__brand-link',
        title: 'Retour à l’accueil du site - any-service-baseline-mock - any-service-name-mock',
        to: '/any-service-homepage-mock',
      }),
      undefined,
    );
  });

  it('should render the logo with a title', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      service: {
        homepage: 'super',
        logo: 'any-service-logo-mock',
      },
    });

    jest
      .mocked(getAccessibleTitle)
      .mockReturnValue('any-service-baseline-mock- any-service-name-mock');

    // When
    const { container, getByAltText } = render(<LayoutFooterBrandComponent />);
    const elementImg = getByAltText('any-service-baseline-mock- any-service-name-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(elementImg).toBeInTheDocument();
    expect(elementImg).toHaveAttribute('src', 'any-service-logo-mock');
    expect(elementImg).toHaveAttribute('alt', 'any-service-baseline-mock- any-service-name-mock');
  });
});

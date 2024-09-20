import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

import { getAccessibleTitle, useSafeContext } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LogoRepubliqueFrancaiseComponent } from '@fc/dsfr';

import { LayoutContext } from '../../../context';
import { LayoutHeaderMobileBurgerButton } from '../burger';
import { LayoutHeaderServiceComponent } from '../service/layout-header.service';
import { LayoutHeaderBrandComponent } from './layout-header.brand';

jest.mock('../service/layout-header.service');
jest.mock('../burger/layout-header.burger');

describe('LayoutHeaderBrandComponent', () => {
  beforeEach(() => {
    // given
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
        'Retour à l’accueil du site - any-service-baseline-mock - any-service-name-mock',
      );
    jest.mocked(useSafeContext).mockReturnValue({ isUserConnected: false });
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutHeaderBrandComponent />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call useSafeContext', () => {
    // when
    render(<LayoutHeaderBrandComponent />);

    // then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(LayoutContext);
  });

  it('should call ConfigService.get with Layout config name', () => {
    // when
    render(<LayoutHeaderBrandComponent />);

    // then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Layout');
  });

  it('should call getAccessibleTitle', () => {
    // given
    jest
      .mocked(getAccessibleTitle)
      .mockReturnValueOnce(expect.any(String))
      .mockReturnValueOnce('any-service-baseline-mock - any-service-name-mock');

    // when
    render(<LayoutHeaderBrandComponent />);

    // then
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

  it('should call Link component', () => {
    // given
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

    // when
    render(<LayoutHeaderBrandComponent />);

    // then
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Retour à l’accueil du site - any-service-baseline-mock - any-service-name-mock',
        to: '/link-to-homepage-mock',
      }),
      {},
    );
  });

  it('should call LogoRepubliqueFrancaiseComponent', () => {
    // when
    render(<LayoutHeaderBrandComponent />);

    // then
    expect(LogoRepubliqueFrancaiseComponent).toHaveBeenCalledOnce();
  });

  it('should render the logo alt text', () => {
    // when
    const { getByAltText } = render(<LayoutHeaderBrandComponent />);
    const element = getByAltText(
      'Retour à l’accueil du site - any-service-baseline-mock - any-service-name-mock',
    );

    // then
    expect(element).toBeInTheDocument();
  });

  it('should call LayoutHeaderMobileBurgerButton', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValueOnce({
      isUserConnected: true,
    });

    // when
    render(<LayoutHeaderBrandComponent />);

    // then
    expect(LayoutHeaderMobileBurgerButton).toHaveBeenCalledOnce();
    expect(LayoutHeaderMobileBurgerButton).toHaveBeenCalledWith({}, {});
  });

  it('should call LayoutHeaderServiceComponent', () => {
    // given
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

    // when
    render(<LayoutHeaderBrandComponent />);

    // then
    expect(LayoutHeaderServiceComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderServiceComponent).toHaveBeenCalledWith({}, {});
  });
});

import { render } from '@testing-library/react';

import { AppContextProvider } from '@fc/state-management';

import { LayoutHomepageLinkComponent } from '../homepage-link';
import { LayoutFooterComponent } from './layout-footer.component';
import { LayoutFooterBottomLinksComponent } from './layout-footer-bottom-links.component';
import { LayoutFooterContentLinksComponent } from './layout-footer-content-links.component';
import { LayoutFooterLicenceComponent } from './layout-footer-licence.component';

jest.mock('@fc/state-management');
jest.mock('./../homepage-link/layout-homepage-link.component');
jest.mock('./layout-footer-bottom-links.component');
jest.mock('./layout-footer-content-links.component');
jest.mock('./layout-footer-licence.component');

describe('LayoutFooterComponent', () => {
  it('should match the snapshot, with default props', () => {
    // given
    const AppConfigMock = { Layout: expect.any(Object) };

    // when
    const { container } = render(
      <AppContextProvider value={{ state: { config: AppConfigMock } }}>
        <LayoutFooterComponent />
      </AppContextProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should render a defined application logo', () => {
    // given
    const AppConfigMock = { Layout: { logo: expect.any(String) } };

    // when
    const { container } = render(
      <AppContextProvider value={{ state: { config: AppConfigMock } }}>
        <LayoutFooterComponent />
      </AppContextProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
    expect(LayoutHomepageLinkComponent).toHaveBeenCalledOnce();
    expect(LayoutHomepageLinkComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        isFooter: true,
      }),
      {},
    );
  });

  it('should render a defined description', () => {
    // given
    const AppConfigMock = { Layout: { footerDescription: 'any-description-mock' } };

    // when
    const { container, getByText } = render(
      <AppContextProvider value={{ state: { config: AppConfigMock } }}>
        <LayoutFooterComponent />
      </AppContextProvider>,
    );
    const element = getByText('any-description-mock');

    // then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
  });

  it('should call LayoutFooterContentLinksComponent', () => {
    // given
    const AppConfigMock = { Layout: expect.any(Object) };

    // when
    render(
      <AppContextProvider value={{ state: { config: AppConfigMock } }}>
        <LayoutFooterComponent />
      </AppContextProvider>,
    );

    // then
    expect(LayoutFooterContentLinksComponent).toHaveBeenCalledOnce();
  });

  it('should render the footerLinkTitle', () => {
    // given
    const AppConfigMock = {
      Layout: {
        footerLinkTitle: 'any-footerLinkTitle-mock',
        logo: 'anylogo-mock',
      },
    };

    // when
    const { getByAltText } = render(
      <AppContextProvider value={{ state: { config: AppConfigMock } }}>
        <LayoutFooterComponent />
      </AppContextProvider>,
    );
    const element = getByAltText('any-footerLinkTitle-mock');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should render defined bottom links', () => {
    // given
    const bottomLinksMock = [
      {
        a11y: 'any-a11y-mock-1',
        href: 'any-href-mock-1',
        label: 'any-label-mock-1',
      },
      {
        a11y: 'any-a11y-mock-2',
        href: 'any-href-mock-2',
        label: 'any-label-mock-2',
      },
    ];
    const AppConfigMock = {
      Layout: {
        bottomLinks: bottomLinksMock,
      },
    };

    // when
    const { container } = render(
      <AppContextProvider value={{ state: { config: AppConfigMock } }}>
        <LayoutFooterComponent />
      </AppContextProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
    expect(LayoutFooterBottomLinksComponent).toHaveBeenCalledOnce();
    expect(LayoutFooterBottomLinksComponent).toHaveBeenCalledWith({ items: bottomLinksMock }, {});
  });

  it('should call LayoutFooterLicenceComponent', () => {
    // given
    const AppConfigMock = { Layout: expect.any(Object) };

    // when
    render(
      <AppContextProvider value={{ state: { config: AppConfigMock } }}>
        <LayoutFooterComponent showLicence />
      </AppContextProvider>,
    );

    // then
    expect(LayoutFooterLicenceComponent).toHaveBeenCalledOnce();
  });

  it('should not render .fr-footer__bottom element when bottomLinks and showLicence are falsy', () => {
    // given
    const AppConfigMock = {
      Layout: {
        bottomLinks: undefined,
      },
    };

    // when
    const { getByTestId } = render(
      <AppContextProvider value={{ state: { config: AppConfigMock } }}>
        <LayoutFooterComponent showLicence={false} />
      </AppContextProvider>,
    );

    // then
    expect(() => {
      getByTestId('sticky-footer-fr-footer__bottom');
    }).toThrow();
  });
});

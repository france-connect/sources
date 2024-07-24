import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';

import { LayoutHomepageLinkComponent } from '../homepage-link';
import { LayoutFooterComponent } from './layout-footer.component';
import { LayoutFooterBottomLinksComponent } from './layout-footer-bottom-links.component';
import { LayoutFooterContentLinksComponent } from './layout-footer-content-links.component';
import { LayoutFooterLicenceComponent } from './layout-footer-licence.component';

jest.mock('./../homepage-link/layout-homepage-link.component');
jest.mock('./layout-footer-bottom-links.component');
jest.mock('./layout-footer-content-links.component');
jest.mock('./layout-footer-licence.component');

jest.mock('@fc/config', () => ({
  ConfigService: {
    get: jest.fn(() => expect.any(Object)),
  },
}));

describe('LayoutFooterComponent', () => {
  it('should call ConfigService.get with layout config name', () => {
    // when
    render(<LayoutFooterComponent />);

    // then
    expect(ConfigService.get).toHaveBeenCalledWith('Layout');
  });

  it('should match the snapshot, with default props', () => {
    // when
    const { container } = render(<LayoutFooterComponent />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should render a defined application logo', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({ logo: expect.any(String) });

    // when
    const { container } = render(<LayoutFooterComponent />);

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
    jest
      .mocked(ConfigService.get)
      .mockReturnValueOnce({ footerDescription: 'any-description-mock' });

    // when
    const { container, getByText } = render(<LayoutFooterComponent />);
    const element = getByText('any-description-mock');

    // then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
  });

  it('should call LayoutFooterContentLinksComponent', () => {
    // when
    render(<LayoutFooterComponent />);

    // then
    expect(LayoutFooterContentLinksComponent).toHaveBeenCalledOnce();
  });

  it('should render the footerLinkTitle', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      footerLinkTitle: 'any-footerLinkTitle-mock',
      logo: 'anylogo-mock',
    });

    // when
    const { getByAltText } = render(<LayoutFooterComponent />);
    const element = getByAltText('any-footerLinkTitle-mock');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should render defined bottom links', () => {
    // given
    const bottomLinksMock = [
      {
        href: 'any-href-mock-1',
        label: 'any-label-mock-1',
        title: 'any-title-mock-1',
      },
      {
        href: 'any-href-mock-2',
        label: 'any-label-mock-2',
        title: 'any-title-mock-2',
      },
    ];
    jest.mocked(ConfigService.get).mockReturnValueOnce({ bottomLinks: bottomLinksMock });

    // when
    const { container } = render(<LayoutFooterComponent />);

    // then
    expect(container).toMatchSnapshot();
    expect(LayoutFooterBottomLinksComponent).toHaveBeenCalledOnce();
    expect(LayoutFooterBottomLinksComponent).toHaveBeenCalledWith({ items: bottomLinksMock }, {});
  });

  it('should call LayoutFooterLicenceComponent', () => {
    // when
    render(<LayoutFooterComponent showLicence />);

    // then
    expect(LayoutFooterLicenceComponent).toHaveBeenCalledOnce();
  });

  it('should not render .fr-footer__bottom element when bottomLinks and showLicence are falsy', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({ bottomLinks: undefined });

    // when
    const { getByTestId } = render(<LayoutFooterComponent showLicence={false} />);

    // then
    expect(() => {
      getByTestId('sticky-footer-fr-footer__bottom');
    }).toThrow();
  });
});

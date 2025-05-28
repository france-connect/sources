import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';
import { LinkComponent } from '@fc/dsfr';

import { LayoutFooterBottomComponent } from './layout-footer.bottom';

describe('LayoutFooterBottomComponent', () => {
  // Given
  const navigationMock = [
    {
      href: 'any-href-mock-1',
      label: 'any-label-mock-1',
      title: 'any-title-mock-1',
    },
    {
      external: true,
      href: 'any-href-mock-2',
      label: 'any-label-mock-2',
      title: 'any-title-mock-2',
    },
  ];

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      features: { showLicence: expect.any(Boolean) },
      footer: { navigation: [expect.any(Object), expect.any(Object)] },
    });
  });

  it('should call ConfigService.get with Layout config name', () => {
    // When
    render(<LayoutFooterBottomComponent />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Layout');
  });

  it('should match the snapshot when features.showLicence is true and footer.navigation is defined', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      features: { showLicence: true },
      footer: { navigation: navigationMock },
    });

    // When
    const { container } = render(<LayoutFooterBottomComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the navigation when footer.navigation is defined', async () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      features: { showLicence: false },
      footer: { navigation: navigationMock },
    });

    // When
    const { container } = render(<LayoutFooterBottomComponent />);

    // Then
    expect(container).toMatchSnapshot();
    expect(LinkComponent).toHaveBeenCalledTimes(2);
    expect(LinkComponent).toHaveBeenNthCalledWith(
      1,
      {
        children: 'any-label-mock-1',
        className: 'fr-footer__bottom-link',
        external: undefined,
        href: 'any-href-mock-1',
        title: 'any-title-mock-1',
      },
      undefined,
    );
    expect(LinkComponent).toHaveBeenNthCalledWith(
      2,
      {
        children: 'any-label-mock-2',
        className: 'fr-footer__bottom-link',
        external: true,
        href: 'any-href-mock-2',
        title: 'any-title-mock-2',
      },
      undefined,
    );
  });

  it('should render the licence when features.showLicence is defined', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      features: { showLicence: true },
      footer: { navigation: [] },
    });

    // When
    const { container, getByText } = render(<LayoutFooterBottomComponent />);
    const textElt = getByText('Sauf mention contraire, tous les contenus de ce site sont sous');

    // Then
    expect(container).toMatchSnapshot();
    expect(textElt).toBeInTheDocument();
    expect(LinkComponent).toHaveBeenCalledOnce();
    expect(LinkComponent).toHaveBeenCalledWith(
      {
        children: 'licence etalab-2.0',
        external: true,
        href: 'https://github.com/etalab/licence-ouverte/blob/master/LO.md',
      },
      undefined,
    );
  });
});

import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';

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
    const { container, findAllByRole, getByTitle } = render(<LayoutFooterBottomComponent />);
    const elementLinks = await findAllByRole('link');
    const elementLink1 = getByTitle('any-title-mock-1');
    const elementLink2 = getByTitle('any-title-mock-2');

    // Then
    expect(container).toMatchSnapshot();
    expect(elementLinks).toHaveLength(2);
    expect(elementLink1).toBeInTheDocument();
    expect(elementLink1).toHaveAttribute('href', 'any-href-mock-1');
    expect(elementLink1).toHaveAttribute('title', 'any-title-mock-1');
    expect(elementLink1).toHaveAttribute('title', 'any-title-mock-1');
    expect(elementLink1).toHaveTextContent('any-label-mock-1');
    expect(elementLink2).toBeInTheDocument();
    expect(elementLink2).toHaveAttribute('href', 'any-href-mock-2');
    expect(elementLink2).toHaveAttribute('title', 'any-title-mock-2');
    expect(elementLink2).toHaveAttribute('title', 'any-title-mock-2');
    expect(elementLink2).toHaveTextContent('any-label-mock-2');
  });

  it('should render the licence when features.showLicence is defined', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      features: { showLicence: true },
      footer: { navigation: [] },
    });

    // When
    const { container, getByRole } = render(<LayoutFooterBottomComponent />);
    const elementLink = getByRole('link');

    // Then
    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent(
      'Sauf mention contraire, tous les contenus de ce site sont sous licence etalab-2.0',
    );
    expect(elementLink).toHaveAttribute(
      'href',
      'https://github.com/etalab/licence-ouverte/blob/master/LO.md',
    );
  });
});

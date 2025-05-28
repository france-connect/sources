import { render } from '@testing-library/react';

import type { NavigationLinkInterface } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LinkComponent } from '@fc/dsfr';
import type { LayoutConfig } from '@fc/layout';

import { SitemapPage } from './sitemap.page';

describe('SitemapPage', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({} as unknown as LayoutConfig);
  });

  it('should match the snapshot, when sitemap prop is not defined', () => {
    // When
    const { container } = render(<SitemapPage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(LinkComponent).not.toHaveBeenCalled();
  });

  it('should match the snapshot, when sitemap prop into layout config is defined', () => {
    // Given
    const sitemapMock = [
      {
        external: false,
        href: '/any-href-mock-1',
        label: 'any-label-mock-1',
        title: 'any-title-mock-1',
      },
      {
        external: true,
        href: '/any-href-mock-2',
        label: 'any-label-mock-2',
        title: 'any-title-mock-2',
      },
    ] as NavigationLinkInterface[];
    jest.mocked(ConfigService.get).mockReturnValueOnce({ sitemap: sitemapMock } as LayoutConfig);

    // When
    const { container } = render(<SitemapPage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(LinkComponent).toHaveBeenCalledTimes(2);
    expect(LinkComponent).toHaveBeenNthCalledWith(
      1,
      {
        children: 'any-label-mock-1',
        external: false,
        href: '/any-href-mock-1',
        title: 'any-title-mock-1',
      },
      undefined,
    );
    expect(LinkComponent).toHaveBeenNthCalledWith(
      2,
      {
        children: 'any-label-mock-2',
        external: true,
        href: '/any-href-mock-2',
        title: 'any-title-mock-2',
      },
      undefined,
    );
  });
});

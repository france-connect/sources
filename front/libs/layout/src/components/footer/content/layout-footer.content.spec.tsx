import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';
import { LinkComponent } from '@fc/dsfr';

import { LayoutFooterContentComponent } from './layout-footer.content';

describe('LayoutFooterContentComponent', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      footer: {
        description: undefined,
        links: undefined,
      },
    });
  });

  it('should call ConfigService.get with Layout config name', () => {
    // When
    render(<LayoutFooterContentComponent />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Layout');
  });

  it('should match the snapshot when description and links are defined', async () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      footer: {
        description: 'any description mock',
        links: [
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
        ],
      },
    });

    // When
    const { container, getByText } = render(<LayoutFooterContentComponent />);
    const descriptionElt = getByText('any description mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(descriptionElt).toBeInTheDocument();
    expect(LinkComponent).toHaveBeenCalledTimes(2);
    expect(LinkComponent).toHaveBeenNthCalledWith(
      1,
      {
        children: 'any-label-mock-1',
        className: 'fr-footer__content-link',
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
        className: 'fr-footer__content-link',
        external: true,
        href: 'any-href-mock-2',
        title: 'any-title-mock-2',
      },
      undefined,
    );
  });
});

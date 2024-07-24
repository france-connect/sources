import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

import { ConfigService } from '@fc/config';

import { LayoutHomepageLinkComponent } from './layout-homepage-link.component';

jest.mock('@fc/config', () => ({
  ConfigService: {
    get: jest.fn(() => ({
      footerLinkTitle: 'any-title',
      homepage: '/',
    })),
  },
}));

describe('LayoutHomepageLinkComponent', () => {
  it('should call ConfigService.get with layout config name', () => {
    // when
    render(
      <LayoutHomepageLinkComponent>
        <div>Test</div>
      </LayoutHomepageLinkComponent>,
    );

    // then
    expect(ConfigService.get).toHaveBeenCalledWith('Layout');
  });

  it('should choose prefix: return to homepage, when isFooter is set at true', () => {
    // when
    render(
      <LayoutHomepageLinkComponent isFooter>
        <div>Test</div>
      </LayoutHomepageLinkComponent>,
    );

    // then
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenLastCalledWith(
      expect.objectContaining({
        title: 'Retour à l’accueil du site - any-title',
        to: '/',
      }),
      {},
    );
  });

  it('should render Link if path is defined', () => {
    // when
    render(
      <LayoutHomepageLinkComponent>
        <div>Test</div>
      </LayoutHomepageLinkComponent>,
    );

    // then
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenLastCalledWith(
      expect.objectContaining({
        title: 'Accueil - any-title',
        to: '/',
      }),
      {},
    );
  });

  it('should render a tag, if homepage is not defined', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({
      footerLinkTitle: 'any-title',
      homepage: undefined,
    });

    // when
    const { getByRole } = render(
      <LayoutHomepageLinkComponent>
        <div>Test</div>
      </LayoutHomepageLinkComponent>,
    );

    // then
    const linkElement = getByRole('link');
    expect(Link).not.toHaveBeenCalled();
    expect(linkElement).toHaveAttribute('aria-disabled', 'true');
    expect(linkElement).toHaveAttribute('title', 'Accueil - any-title');
  });
});

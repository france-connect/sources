import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

import { AppContextProvider } from '@fc/state-management';

import { LayoutHomepageLinkComponent } from './layout-homepage-link.component';

describe('LayoutHomepageLinkComponent', () => {
  // given
  const appContextConfigMock = {
    config: {
      Layout: {
        footerLinkTitle: 'any-title',
        homepage: '/',
      },
    },
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should choose prefix: return to homepage, when isFooter is set at true', () => {
    // when
    render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHomepageLinkComponent isFooter>
          <div>Test</div>
        </LayoutHomepageLinkComponent>
      </AppContextProvider>,
    );

    // then
    expect(Link).toHaveBeenCalledTimes(1);
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
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHomepageLinkComponent>
          <div>Test</div>
        </LayoutHomepageLinkComponent>
      </AppContextProvider>,
    );

    // then
    expect(Link).toHaveBeenCalledTimes(1);
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
    const configMock = {
      ...appContextConfigMock,
      config: {
        Layout: {
          footerLinkTitle: 'any-title',
        },
      },
    };

    // when
    const { getByRole } = render(
      <AppContextProvider value={configMock}>
        <LayoutHomepageLinkComponent>
          <div>Test</div>
        </LayoutHomepageLinkComponent>
      </AppContextProvider>,
    );

    // then
    const linkElement = getByRole('link');
    expect(Link).not.toHaveBeenCalled();
    expect(linkElement).toHaveAttribute('aria-disabled', 'true');
    expect(linkElement).toHaveAttribute('title', 'Accueil - any-title');
  });
});

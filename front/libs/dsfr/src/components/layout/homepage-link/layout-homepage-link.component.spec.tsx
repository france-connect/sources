import { render } from '@testing-library/react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContextProvider } from '@fc/state-management';

import { LayoutHomepageLinkComponent } from './layout-homepage-link.component';

jest.mock('@fc/state-management');

jest.mock('react', () => {
  const actualReact = jest.requireActual('react');
  return {
    ...actualReact,
    useContext: jest.fn(),
  };
});

describe('LayoutHomepageLinkComponent', () => {
  // given
  const appContextConfigMock = {
    state: {
      config: {
        Layout: {
          footerLinkTitle: 'any-title',
          homepage: '/',
        },
      },
    },
  };

  it('should choose prefix: return to homepage, when isFooter is set at true', () => {
    // given
    jest.mocked(useContext).mockReturnValueOnce(appContextConfigMock);

    // when
    render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHomepageLinkComponent isFooter>
          <div>Test</div>
        </LayoutHomepageLinkComponent>
      </AppContextProvider>,
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
    // given
    jest.mocked(useContext).mockReturnValueOnce(appContextConfigMock);

    // when
    render(
      <AppContextProvider value={appContextConfigMock}>
        <LayoutHomepageLinkComponent>
          <div>Test</div>
        </LayoutHomepageLinkComponent>
      </AppContextProvider>,
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
    const configMock = {
      state: {
        ...appContextConfigMock,
        config: {
          Layout: {
            footerLinkTitle: 'any-title',
          },
        },
      },
    };
    jest.mocked(useContext).mockReturnValue(configMock);

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

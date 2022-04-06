import { Helmet } from 'react-helmet';

import { renderWithRouter } from '@fc/tests-utils';

import { LayoutFooterComponent } from './footer.component';
import { ApplicationLayout, getDocumentTitle } from './layout.component';
import { LayoutHeaderComponent } from './layout-header';

// given
jest.mock('react-helmet');
jest.mock('./footer.component');
jest.mock('./layout-header/layout-header.component');

const routes = [
  {
    component: () => <div>route-1</div>,
    id: 'route-1',
    label: 'route-1',
    order: 0,
    path: '/route-1',
  },
  {
    component: () => <div>route-2</div>,
    id: 'route-2',
    label: 'route-2',
    order: 1,
    path: '/route-2',
  },
];

describe('ApplicationLayout', () => {
  const config = {
    bottomLinks: [
      {
        a11y: 'mock-a11y',
        href: 'mock-href',
        label: 'mock-label',
      },
    ],
    footerDescription: 'mock-footerDescription',
    footerLinkTitle: 'mock-footerLinkTitle',
    logo: jest.fn(() => <div>mock-logo</div>),
    returnButton: jest.fn(() => <div>mock-returnButton</div>),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have render the page title with react helmet', () => {
    // given
    renderWithRouter(<ApplicationLayout config={config} routes={routes} />);
    // then
    expect(Helmet).toHaveBeenCalled();
  });

  it('should have render LayoutHeaderComponent with props', () => {
    // given
    renderWithRouter(<ApplicationLayout config={config} routes={routes} />);
    // then
    expect(LayoutHeaderComponent).toHaveBeenCalled();
    expect(LayoutHeaderComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        logo: config.logo,
        returnButton: config.returnButton,
        title: config.footerLinkTitle,
      }),
      {},
    );
  });

  it('should have render LayoutFooterComponent with props', () => {
    // given
    renderWithRouter(<ApplicationLayout config={config} routes={routes} />);
    // then
    expect(LayoutFooterComponent).toHaveBeenCalled();
    expect(LayoutFooterComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        bottomLinks: config.bottomLinks,
        description: config.footerDescription,
        linkTitle: config.footerLinkTitle,
        logo: config.logo,
        topLinks: [
          {
            a11y: 'Accèder au site legifrance.gouv.fr nouvelle fenêtre',
            href: 'https://www.legifrance.gouv.fr',
            label: 'legifrance.gouv.fr',
          },
          {
            a11y: 'Accèder au site gouvernement.fr nouvelle fenêtre',
            href: 'https://www.gouvernement.fr',
            label: 'gouvernement.fr',
          },
          {
            a11y: 'Accèder au site service-public.fr nouvelle fenêtre',
            href: 'https://www.service-public.fr/',
            label: 'service-public.fr',
          },
          {
            a11y: 'Accèder au site data.gouv.fr nouvelle fenêtre',
            href: 'https://data.gouv.fr',
            label: 'data.gouv.fr',
          },
        ],
      }),
      {},
    );
  });
});

describe('ApplicationLayout.getDocumentTitle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should output page title from current route', () => {
    // given
    const route = routes[0];
    const result = getDocumentTitle(route);
    // then
    expect(result).toStrictEqual(`${route.label} - `);
  });

  it('should output empty string if route object.label is falsy', () => {
    // given
    const route = { component: () => <div />, id: 'any', label: undefined, path: 'any' };
    const result = getDocumentTitle(route);
    // then
    expect(result).toStrictEqual('');
  });
});

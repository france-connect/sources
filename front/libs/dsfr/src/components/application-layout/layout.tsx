import { Helmet } from 'react-helmet';
import {
  matchPath,
  Route,
  RouteProps,
  Switch,
  useLocation,
} from 'react-router-dom';

import { RouteItem } from '@fc/routing';

import '../../index.scss';
import { LayoutFooterComponent } from './footer';
import { LayoutHeaderComponent } from './header';
import { ApplicationLayoutProps } from './props.interface';

const getDocumentTitle = (obj: RouteItem) =>
  `${obj && obj.label ? `${obj.label} - ` : ''}`;

const getCurrentRouteObjectByPath = (
  entries: RouteItem[],
  locationPathname: string,
) =>
  (entries &&
    entries.filter(
      (obj) => obj && matchPath(locationPathname, obj as RouteProps),
    )[0]) ||
  null;

export function ApplicationLayout({
  routes,
  config,
}: ApplicationLayoutProps): JSX.Element {
  const { pathname } = useLocation();
  const { logo, bottomLinks, footerLinkTitle, footerDescription, returnButton } = config;
  const currentRouteObj = getCurrentRouteObjectByPath(routes, pathname);
  const documentTitle = getDocumentTitle(currentRouteObj);

  return (
    <div className="sticky-body">
      <div className="sticky-content">
        <Helmet>
          <title>{documentTitle}</title>
        </Helmet>
        <LayoutHeaderComponent logo={logo} title={footerLinkTitle} returnButton={returnButton} />
        <Switch>
          {routes.map((route) => (
            <Route {...route} key={route.path} />
          ))}
        </Switch>
      </div>
      <LayoutFooterComponent
        logo={logo}
        linkTitle={footerLinkTitle}
        bottomLinks={bottomLinks}
        description={footerDescription}
        topLinks={[
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
        ]}
      />
    </div>
  );
}

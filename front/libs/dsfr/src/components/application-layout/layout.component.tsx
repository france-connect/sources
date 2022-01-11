import '../../index.scss';

// @TODO remove react-helmet -> cause error dans la console
// pas necessaire, peut facilement etre remplacé par un composant custom
// pour changer le titre de la page HTML
import { Helmet } from 'react-helmet';
import { matchPath, Route, RouteProps, Switch, useLocation } from 'react-router-dom';

import { RouteItem } from '@fc/routing';

import { LayoutFooterComponent } from './footer.component';
import { LayoutHeaderComponent } from './header.component';
import { ApplicationLayoutProps } from './props.interface';

// @TODO extraction -> utils + refacto pour simplification et lisibilité
export const getDocumentTitle = (obj: RouteItem) => `${obj && obj.label ? `${obj.label} - ` : ''}`;

// @TODO extraction -> utils + refacto pour simplification et lisibilité
export const getCurrentRouteObjectByPath = (entries: RouteItem[], locationPathname: string) =>
  (entries && entries.filter((obj) => obj && matchPath(locationPathname, obj as RouteProps))[0]) ||
  null;

export function ApplicationLayout({ config, routes }: ApplicationLayoutProps): JSX.Element {
  const { pathname } = useLocation();
  const { bottomLinks, footerDescription, footerLinkTitle, logo, returnButton } = config;
  const currentRouteObj = getCurrentRouteObjectByPath(routes, pathname);
  const documentTitle = getDocumentTitle(currentRouteObj);

  return (
    <div className="sticky-body">
      <div className="sticky-content">
        <Helmet>
          <title>{documentTitle}</title>
        </Helmet>
        <LayoutHeaderComponent logo={logo} returnButton={returnButton} title={footerLinkTitle} />
        <Switch>
          {routes.map((route) => {
            const { component, exact, path } = route;
            return <Route key={route.path} component={component} exact={exact} path={path} />;
          })}
        </Switch>
      </div>
      <LayoutFooterComponent
        bottomLinks={bottomLinks}
        description={footerDescription}
        linkTitle={footerLinkTitle}
        logo={logo}
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

import { LayoutConfig } from '@fc/dsfr';
import { LogoFranceConnectComponent } from '../ui/components/logo-france-connect/logo-france-connect.component';

const Layout: LayoutConfig = {
  bottomLinks: [
    {
      a11y: 'Plan du site',
      href: 'https://franceconnect.gouv.fr/plan-site',
      label: 'Plan du site',
    },
    {
      a11y: 'Accesibilité',
      href: 'https://franceconnect.gouv.fr/accessibilite',
      label: 'Accesibilité',
    },
    {
      a11y: 'Mentions légales',
      href: 'https://franceconnect.gouv.fr/mentions-legales',
      label: 'Mentions légales',
    },
    {
      a11y: 'Données personnelles',
      href: 'https://franceconnect.gouv.fr/cgu',
      label: 'Données personnelles',
    },
    {
      a11y: 'Gestion des cookies',
      href: 'https://franceconnect.gouv.fr/cgu',
      label: 'Gestion des cookies',
    },
  ],
  footerDescription:
    'FranceConnect est un dispositif qui permet aux internautes de s’identifier sur un service en ligne par l’intermédiaire d’un compte existant (impots.gouv.fr, ameli.fr…).',
  footerLinkTitle: 'Agent connect',
  logo: LogoFranceConnectComponent,
};

export default Layout;

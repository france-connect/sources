import { LayoutConfig } from '@fc/dsfr';
import { LogoAgentConnectComponent } from '../components/logo-agent-connect';
import { ReturnButtonComponent } from '../components/return-button';

const Layout: LayoutConfig = {
  bottomLinks: [
    {
      a11y: 'Plan du site nouvelle page',
      href: 'https://agentconnect.gouv.fr/plan-du-site',
      label: 'Plan du site',
    },
    {
      a11y: 'Accessibilité nouvelle page',
      href: 'https://agentconnect.gouv.fr/accessibilite',
      label: 'Accessibilité',
    },
    {
      a11y: 'Mentions légales nouvelle page',
      href: 'https://agentconnect.gouv.fr/mentions-legales',
      label: 'Mentions légales',
    },
    {
      a11y: 'Données personnelles nouvelle page',
      href: 'https://agentconnect.gouv.fr/cgu#url-anchor-dp',
      label: 'Données personnelles',
    },
    {
      a11y: 'Gestion des cookies nouvelle page',
      href: 'https://agentconnect.gouv.fr/cgu#url-anchor-gdc',
      label: 'Gestion des cookies',
    },
    {
      a11y: 'Conditions générales d’utilisation nouvelle page',
      href: 'https://agentconnect.gouv.fr/cgu',
      label: 'Conditions générales d’utilisation',
    },
    {
      a11y: 'Aide nouvelle page',
      href: 'https://agentconnect.gouv.fr/aide',
      label: 'Aide',
    },
  ],

  footerDescription:
    "AgentConnect est le dispositif d’identification conçu par l’État pour les ministères et les opérateurs de l’État qui vous permet d’accéder à de nombreux services en ligne en utilisant l’un de vos comptes professionnels existants.",
  footerLinkTitle: 'Agent connect',

  logo: LogoAgentConnectComponent,
  returnButton: ReturnButtonComponent,
};

export default Layout;

import { LayoutConfig } from '@fc/dsfr';
import { LogoAgentConnectComponent } from '../components/logo-agent-connect';
import { ReturnButtonComponent } from '../components/return-button';

const Layout: LayoutConfig = {
  bottomLinks: [
    {
      a11y: 'Plan du site',
      href: 'https://agentconnect.gouv.fr/plan-site',
      label: 'Plan du site',
    },
    {
      a11y: 'Accesibilité',
      href: 'https://agentconnect.gouv.fr/accessibilite',
      label: 'Accesibilité',
    },
    {
      a11y: 'Mentions légales',
      href: 'https://agentconnect.gouv.fr/mentions-legales',
      label: 'Mentions légales',
    },
    {
      a11y: 'Données personnelles',
      href: 'https://agentconnect.gouv.fr/cgu',
      label: 'Données personnelles',
    },
    {
      a11y: 'Gestion des cookies',
      href: 'https://agentconnect.gouv.fr/cgu',
      label: 'Gestion des cookies',
    },
  ],

  footerDescription:
    "AgentConnect est le dispositif d'identification conçu par l'État pour les ministères et les opérateurs de l'État qui vous permet d'accéder à de nombreux services en ligne en utilisant l'un de vos comptes professionnels existants.",
  footerLinkTitle: 'Agent connect',

  logo: LogoAgentConnectComponent,
  returnButton: ReturnButtonComponent,
};

export default Layout;

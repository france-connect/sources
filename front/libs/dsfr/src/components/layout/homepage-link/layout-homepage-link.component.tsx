import classnames from 'classnames';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext, AppContextInterface } from '@fc/state-management';

interface LayoutHomepageLinkComponentProps {
  children: React.ReactNode;
  isFooter?: boolean;
}

export const LayoutHomepageLinkComponent: React.FC<LayoutHomepageLinkComponentProps> = React.memo(
  ({ children, isFooter }: LayoutHomepageLinkComponentProps): JSX.Element => {
    // @TODO use ConfigService instead of Context; first ConfigService needs to be initialized
    const { state } = useContext<AppContextInterface>(AppContext);
    const layoutConfig = state.config.Layout;
    const { footerLinkTitle, homepage } = layoutConfig;

    // @TODO use i18n translation library
    const prefix = isFooter ? 'Retour à l’accueil du site' : 'Accueil';
    const title = `${prefix} - ${footerLinkTitle}`;
    const footerClassname = classnames({
      // DSFR classname
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'fr-footer__brand-link': isFooter,
    });

    return homepage ? (
      <Link className={footerClassname} title={title} to={homepage}>
        {children}
      </Link>
    ) : (
      // DSFR forces us to use <a href=""/> for accessibility; for AgentConnect app: it is a single page application with a dynamic URL
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a
        aria-disabled="true"
        className={footerClassname}
        role="link"
        style={{ cursor: 'pointer' }}
        title={title}>
        {children}
      </a>
    );
  },
);

LayoutHomepageLinkComponent.defaultProps = {
  isFooter: false,
};

LayoutHomepageLinkComponent.displayName = 'LayoutHomepageLinkComponent';

import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

import { ConfigService } from '@fc/config';

import { Options } from '../../../enums';
import type { LayoutConfig } from '../../../interfaces';

interface LayoutHomepageLinkComponentProps extends Required<PropsWithChildren> {
  isFooter?: boolean;
}

export const LayoutHomepageLinkComponent = React.memo(
  ({ children, isFooter = false }: LayoutHomepageLinkComponentProps) => {
    const config = ConfigService.get<LayoutConfig>(Options.CONFIG_NAME);
    const { footerLinkTitle, homepage } = config;

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
      // @TODO Check the comment for the eslint rule below from #1005
      // AgentConnect has been removed
      //
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

LayoutHomepageLinkComponent.displayName = 'LayoutHomepageLinkComponent';

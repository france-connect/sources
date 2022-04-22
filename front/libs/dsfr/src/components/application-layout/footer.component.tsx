/* istanbul ignore file */

// @TODO refacto en multiple composants
import classnames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

import { LogoMarianneComponent } from '../assets';

const useStyles = createUseStyles({
  bottomNav: {
    borderColor: '#cecece',
    borderStyle: 'solid',
    borderTopWidth: 1,
  },
  footer: {
    '& .logo-agentconnect': {
      width: 140,
    },
    borderBottomColor: '#cecece',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#000091',
    borderTopWidth: 2,
  },
  licence: {
    '& svg': {
      color: '#6a6a6a',
      fontSize: '1rem',
      marginBottom: 3,
      marginLeft: 3,
    },
  },
  wrapper: {
    '&.is-tablet > div': {
      width: '100%',
    },
  },
});

type LinkObject = {
  // @TODO move to fc/front/libs
  href: string;
  label: string;
  a11y: string;
};

type LayoutFooterProps = {
  // @TODO move to fc/front/libs
  topLinks: LinkObject[];
  bottomLinks: LinkObject[];
  description: string;
  logo: React.FunctionComponent;
  linkTitle: string;
};

export const LayoutFooterComponent = React.memo(
  ({
    bottomLinks,
    description,
    linkTitle,
    logo: Logo,
    topLinks,
  }: LayoutFooterProps): JSX.Element => {
    // @TODO move to fc/front/libs
    const classes = useStyles();
    // @TODO exporter les variables responsive : $breakpoint-tablet
    // depuis le CSS vers des constantes JS
    // quand les libs partagées CSS seront crées
    const gtTablet = useMediaQuery({ query: '(max-width: 992px)' });
    return (
      <footer className={classnames(classes.footer, 'sticky-footer')} role="contentinfo">
        <div
          className={classnames(
            classes.wrapper,
            'content-wrapper-lg flex-wrapper wrap-2 items-center px20 pt40',
            { 'is-tablet': gtTablet },
          )}>
          <div className="mb24">
            <Link className="flex-columns flex-start items-center" title={linkTitle} to="/">
              <LogoMarianneComponent className="mr40" />
              <Logo />
            </Link>
          </div>
          <div className="mb24">
            <p className="fr-text-sm">{description}</p>
            <nav className="mt16 is-bold fr-text-sm" role="navigation">
              {topLinks.map((linkObj: LinkObject, index: number) => {
                const { a11y, href, label } = linkObj;
                const uniqkey = `${href}::${index}`;
                return (
                  <a
                    key={uniqkey}
                    className="mr24 is-inline-block"
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                    title={a11y}>
                    {label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
        <div className={classes.bottomNav}>
          <div className={classnames('content-wrapper-lg', 'px20')}>
            <nav className="fr-text-xs pb16 pt8">
              {bottomLinks.map((linkObj: LinkObject, index: number) => {
                const isLast = index === bottomLinks.length - 1;
                const { a11y, href, label } = linkObj;
                const uniqkey = `${href}::${index}`;
                return (
                  <span key={uniqkey}>
                    <a
                      key={uniqkey}
                      className="is-inline-block"
                      href={href}
                      rel="noopener noreferrer"
                      target="_blank"
                      title={a11y}>
                      {label}
                    </a>
                    {!isLast && <span className="mx12 is-g400">|</span>}
                  </span>
                );
              })}
            </nav>
          </div>
        </div>
      </footer>
    );
  },
);

LayoutFooterComponent.displayName = 'LayoutFooterComponent';

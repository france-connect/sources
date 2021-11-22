import classnames from 'classnames';
import React from 'react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { createUseStyles } from 'react-jss';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

import { LogoMarianneComponent } from '../logo-marianne';

const useStyles = createUseStyles({
  bottomNav: {
    borderColor: '#CECECE',
    borderStyle: 'solid',
    borderTopWidth: 1,
  },
  footer: {
    borderBottomColor: '#CECECE',
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
    topLinks,
    linkTitle,
    logo,
  }: LayoutFooterProps): JSX.Element => {
    const Logo = logo;
    // @TODO move to fc/front/libs
    const classes = useStyles();
    // @TODO exporter les variables responsive : $breakpoint-tablet
    // depuis le CSS vers des constantes JS
    // quand les libs partagées CSS seront crées
    const isTablet = useMediaQuery({ query: '(max-width: 768px)' });
    return (
      <footer
        className={classnames(classes.footer, 'sticky-footer')}
        role="contentinfo"
      >
        <div
          className={classnames(
            classes.wrapper,
            'content-wrapper-lg flex-wrapper wrap-2 items-center px20 pt40',
            { 'is-tablet': isTablet },
          )}
        >
          <div className="mb24">
            <Link
              className="flex-columns flex-start items-center"
              title={linkTitle}
              to="/"
            >
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
                    title={a11y}
                  >
                    {label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="content-wrapper-lg px20">
          <nav className={classnames(classes.bottomNav, 'fr-text-xs pb16 pt8')}>
            {bottomLinks.map((linkObj: LinkObject, index: number) => {
              const isfirst = index === 0;
              const { a11y, href, label } = linkObj;
              const uniqkey = `${href}::${index}`;
              return (
                <React.Fragment key={uniqkey}>
                  {!isfirst && <span className="mx12 is-grey-400">|</span>}
                  <a
                    key={uniqkey}
                    className="is-inline-block"
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                    title={a11y}
                  >
                    {label}
                  </a>
                </React.Fragment>
              );
            })}
          </nav>
          <div className="pb8">
            <p className="fr-text-xs is-grey-600">
              Sauf mention contraire, tous les textes de ce site sont sous{' '}
              <a
                className={classnames(
                  classes.licence,
                  'is-underline is-inline-block',
                )}
                href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                rel="noopener noreferrer"
                target="_blank"
                title="télécharger la licence etalab 2.0"
              >
                <span>licence&nbsp;etalab-2.0</span>
                <RiExternalLinkLine />
              </a>
            </p>
          </div>
        </div>
      </footer>
    );
  },
);

LayoutFooterComponent.displayName = 'LayoutFooterComponent';

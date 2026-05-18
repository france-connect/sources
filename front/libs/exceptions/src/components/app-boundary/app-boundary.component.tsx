import type { FallbackProps } from 'react-error-boundary';
import { useDocumentTitle } from 'usehooks-ts';

import { LogoFranceConnect } from '@fc/assets';
import { isErrorLike, Strings } from '@fc/common';

// @TODO
// - translate with i18n
// - find a way to not duplicate code from @fc/dsfr
export const AppBoundaryComponent = ({ error }: FallbackProps) => {
  useDocumentTitle('FranceConnect - Erreur');

  // @NOTE TSError : img.src should be a string
  const logo = LogoFranceConnect as unknown as string;

  const iserror = isErrorLike(error);
  const errorMessage = iserror ? error.message : String(error);
  const errorStack = iserror ? error.stack?.split(Strings.NEW_LINE) : [];

  const hasStack = errorStack && errorStack.length > 0;

  return (
    <div className="sticky-body">
      <div className="sticky-content">
        {/* <!-- APPLICATION HEADER --> */}
        <header className="fr-header" role="banner">
          <div className="fr-header__body">
            <div className="fr-container">
              <div className="fr-header__body-row">
                <div className="fr-header__brand fr-enlarge-link">
                  <div className="fr-header__brand-top">
                    <div className="fr-header__logo">
                      <a
                        aria-disabled="true"
                        href="/"
                        style={{ cursor: 'pointer' }}
                        title="République Française">
                        <p className="fr-logo">
                          République
                          <br />
                          Française
                        </p>
                      </a>
                    </div>
                    <div className="fr-header__operator">
                      <img alt="FranceConnect" className="fr-responsive-img" src={logo} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* <!-- endof APPLICATION HEADER --> */}
        <main className="fr-container fr-my-8w">
          {/* <!-- APPLICATION CONTENT --> */}
          <h1>Oooops, Something went wrong ! 🤷</h1>
          <div className="fr-alert fr-alert--error fr-alert--md">
            <h3 className="fr-alert__title">{errorMessage}</h3>
            {hasStack && (
              <ul data-testid="app-boundary-error-stack">
                {errorStack.map((str: string, index: number) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={`error-stack::${index}`}>{str}</li>
                ))}
              </ul>
            )}
          </div>
          {/* <!-- endof APPLICATION CONTENT --> */}
        </main>
      </div>
      {/* <!-- APPLICATION FOOTER --> */}
      <footer className="sticky-footer fr-footer" id="footer" role="contentinfo">
        <div className="fr-container">
          <div className="fr-footer__body">
            <div className="fr-footer__brand fr-enlarge-link">
              <p className="fr-logo">
                République
                <br />
                Française
              </p>
              <a
                aria-disabled="true"
                className="fr-footer__brand-link"
                href="/"
                style={{ cursor: 'pointer' }}
                title="République Française">
                <img
                  alt="FranceConnect"
                  className="fr-footer__logo fr-responsive-img"
                  src={logo}
                  style={{ height: 90, maxHeight: 90 }}
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* <!-- endof APPLICATION FOOTER --> */}
    </div>
  );
};

import classnames from 'classnames';
import React from 'react';

import styles from './return-button.module.scss';
import { useReturnButton } from './use-return-button.hook';

interface ReturnButtonComponentProps {
  url: string;
  isMobileViewport?: boolean;
}

export const ReturnButtonComponent: React.FC<ReturnButtonComponentProps> = React.memo(
  ({ isMobileViewport, url }: ReturnButtonComponentProps) => {
    const { historyBackURL, serviceProviderName, showButton } = useReturnButton(url);

    const WrapperComponent = ({ children }: { children: React.ReactNode }) => {
      if (!isMobileViewport) {
        return <li>{children}</li>;
      }
      return (
        <div
          className={classnames({
            // @NOTE unable to create a eslint rule to match this case
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-n8v': showButton,
            // @NOTE unable to create a eslint rule to match this case
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-p-2w': showButton,
          })}>
          {children}
        </div>
      );
    };

    return (
      <WrapperComponent>
        {(showButton && (
          <a
            className={classnames(styles.button, 'fr-btn  fr-fi-arrow-left-line', {
              // @NOTE unable to create a eslint rule to match this case
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'fr-btn--icon-left': isMobileViewport,
              // @NOTE unable to create a eslint rule to match this case
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'fr-btn--md': isMobileViewport,
              // @NOTE unable to create a eslint rule to match this case
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'is-mobile-viewport': isMobileViewport,
              // @NOTE unable to create a eslint rule to match this case
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'text-center': isMobileViewport,
              w100: isMobileViewport,
            })}
            data-testid="service-provider-back-button"
            href={historyBackURL}
            title="retourner à l’écran précédent">
            <span>Revenir sur {serviceProviderName}</span>
          </a>
        )) || <span />}
      </WrapperComponent>
    );
  },
);

ReturnButtonComponent.defaultProps = {
  isMobileViewport: false,
};

ReturnButtonComponent.displayName = 'ReturnButtonComponent';

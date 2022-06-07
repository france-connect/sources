import classnames from 'classnames';
import React from 'react';

import { ButtonTypes } from '../../enums';

interface FranceConnectButtonProps {
  showIcon?: boolean;
  className?: string;
  showHelp?: boolean;
  buttonType?: ButtonTypes;
}

export const FranceConnectButton: React.FC<FranceConnectButtonProps> = React.memo(
  ({ buttonType, className, showHelp, showIcon }: FranceConnectButtonProps) => {
    const target = showIcon ? '_blank' : undefined;
    const rel = showIcon ? 'noreferrer' : undefined;
    return (
      <div className={classnames('fr-connect-group', className)}>
        <button className="fr-connect" type={buttonType}>
          <span className="fr-connect__login">S’identifier avec</span>
          <span className="fr-connect__brand">FranceConnect</span>
        </button>
        {showHelp && (
          <p>
            <a
              href="https://franceconnect.gouv.fr/"
              rel={rel}
              target={target}
              title="Qu’est ce que FranceConnect ? - nouvelle fenêtre">
              Qu’est ce que FranceConnect ?
            </a>
          </p>
        )}
      </div>
    );
  },
);

FranceConnectButton.defaultProps = {
  buttonType: ButtonTypes.BUTTON,
  className: undefined,
  showHelp: false,
  showIcon: false,
};

FranceConnectButton.displayName = 'FranceConnectButton';

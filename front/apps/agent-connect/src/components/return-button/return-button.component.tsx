import './return-button.scss';

import classNames from 'classnames';
import { RiArrowLeftLine as BackIcon } from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive';

import { useReturnButton } from './use-return-button.hook';

export const ReturnButtonComponent = () => {
  const gtTablet = useMediaQuery({ query: '(min-width: 992px)' });
  const { historyBackURL, serviceProviderName, showButton } = useReturnButton();

  if (!showButton) {
    return <span />;
  }

  return (
    <a
      className={classNames('return-button flex-columns items-center no-underline fs14 px12', {
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'bg-g200': !gtTablet,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'flex-end': gtTablet,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'is-mobile': !gtTablet,
        m16: !gtTablet,
      })}
      href={historyBackURL}
      title="retourner à l’écran précédent">
      <i className="is-block mr8 p5">
        <BackIcon />
      </i>
      <span>Revenir sur {serviceProviderName}</span>
    </a>
  );
};

ReturnButtonComponent.displayName = 'ReturnButtonComponent';

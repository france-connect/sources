import { ButtonEventType } from '@fc/oidc-client';
import './button-load.scss';

type LoadButtonProps = {
  onClick: ButtonEventType;
};

export const ButtonLoadComponent = ({
  onClick,
}: LoadButtonProps): JSX.Element => {
  return (
    <button
      className="ButtonLoadComponent fs18 p12"
      type="button"
      onClick={onClick}
    >
      <span>LOAD SOMETHING</span>
    </button>
  );
};

ButtonLoadComponent.displayName = 'ButtonLoadComponent';

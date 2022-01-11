import './button-load.scss';

type LoadButtonProps = {
  onClick: React.MouseEventHandler;
};

export const ButtonLoadComponent = ({ onClick }: LoadButtonProps): JSX.Element => (
  <button className="ButtonLoadComponent fs18 p12" type="button" onClick={onClick}>
    <span>LOAD SOMETHING</span>
  </button>
);

ButtonLoadComponent.displayName = 'ButtonLoadComponent';

import LogoSVG from './logo.svg';

type LogoFranceConnectPlusProps = {
  className?: string;
};

export const LogoFranceConnectComponent = ({
  className,
}: LogoFranceConnectPlusProps) => (
  <div className={className}>
    <img alt="marianne hexagonale franceconnect plus" src={LogoSVG} />
  </div>
);

LogoFranceConnectComponent.defaultProps = {
  className: '',
};

LogoFranceConnectComponent.displayName = 'LogoFranceConnectComponent';

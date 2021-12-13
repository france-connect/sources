import LogoSVG from './logo.svg';

type LogoAgentConnectProps = {
  className?: string;
};

export const LogoAgentConnectComponent = ({
  className,
}: LogoAgentConnectProps) => (
  <div className={className}>
    <img
      className="logo-agentconnect"
      src={LogoSVG}
      alt="marianne hexagonale agentconnect"
    />
  </div>
);

LogoAgentConnectComponent.defaultProps = {
  className: '',
};

LogoAgentConnectComponent.displayName = 'LogoAgentConnectComponent';

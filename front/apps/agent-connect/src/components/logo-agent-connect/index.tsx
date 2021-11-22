import LogoSVG from './logo.svg';

type LogoAgentConnectProps = {
  className?: string;
};

export const LogoAgentConnectComponent = ({
  className,
}: LogoAgentConnectProps) => (
  <div className={className}>
    <img
      alt="marianne hexagonale agentconnect"
      height="auto"
      src={LogoSVG}
      width="140"
    />
  </div>
);

LogoAgentConnectComponent.defaultProps = {
  className: '',
};

LogoAgentConnectComponent.displayName = 'LogoAgentConnectComponent';

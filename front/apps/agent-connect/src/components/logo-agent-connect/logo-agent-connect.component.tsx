import LogoSVG from './logo-agent-connect.svg';

type LogoAgentConnectComponentProps = {
  className?: string;
};

export const LogoAgentConnectComponent = ({ className }: LogoAgentConnectComponentProps) => (
  <div className={className}>
    <img alt="marianne hexagonale agentconnect" className="logo-agentconnect" src={LogoSVG} />
  </div>
);

LogoAgentConnectComponent.defaultProps = {
  className: '',
};

LogoAgentConnectComponent.displayName = 'LogoAgentConnectComponent';

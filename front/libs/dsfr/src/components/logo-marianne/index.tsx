import LogoSVG from './logo.svg';

type LogoMarianneProps = {
  className?: string;
};

export const LogoMarianneComponent = ({ className }: LogoMarianneProps) => (
  <div className={className}>
    <img src={LogoSVG} alt="république francaise" className="logo-marianne" />
  </div>
);

LogoMarianneComponent.defaultProps = {
  className: '',
};

LogoMarianneComponent.displayName = 'LogoMarianneComponent';

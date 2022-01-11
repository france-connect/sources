import LogoSVG from './logo-marianne.svg';

type LogoMarianneProps = {
  className?: string;
};

export const LogoMarianneComponent = ({ className }: LogoMarianneProps) => (
  <div className={className} data-testid="logo-marianne-wrapper">
    <img alt="république française" className="logo-marianne" src={LogoSVG} />
  </div>
);

LogoMarianneComponent.defaultProps = {
  className: '',
};

LogoMarianneComponent.displayName = 'LogoMarianneComponent';

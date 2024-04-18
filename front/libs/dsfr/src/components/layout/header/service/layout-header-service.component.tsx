import type { HeaderService } from '../../../../interfaces';

export interface LayoutHeaderServiceComponentProps {
  service: HeaderService;
}

export const LayoutHeaderServiceComponent: React.FC<LayoutHeaderServiceComponentProps> = ({
  service,
}: LayoutHeaderServiceComponentProps) => (
  <div className="fr-header__service" data-testid="layout-header-service-component">
    <a href={service.href || '/'} title={service.title}>
      <p className="fr-header__service-title" data-testid="layout-header-service-component-name">
        {service.name}
      </p>
    </a>
    {service.baseline && (
      <p
        className="fr-header__service-tagline"
        data-testid="layout-header-service-component-baseline">
        {service.baseline}
      </p>
    )}
  </div>
);

LayoutHeaderServiceComponent.displayName = 'LayoutHeaderServiceComponent';

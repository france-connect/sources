import { t } from '@fc/i18n';

interface ServiceProviderLinkInstancesPageHeaderComponentProps {
  serviceProviderName?: string;
}

export const ServiceProviderLinkInstancesPageHeaderComponent = ({
  serviceProviderName = '',
}: ServiceProviderLinkInstancesPageHeaderComponentProps) => (
  <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
    <h1 className="fr-display--sm">{t('Partners.linkInstances.title')}</h1>
    <p className="fr-text--lead fr-mb-3w">
      {t('Partners.linkInstances.description', {
        serviceProviderName,
      })}
    </p>
  </div>
);

ServiceProviderLinkInstancesPageHeaderComponent.displayName =
  'ServiceProviderLinkInstancesPageHeaderComponent';

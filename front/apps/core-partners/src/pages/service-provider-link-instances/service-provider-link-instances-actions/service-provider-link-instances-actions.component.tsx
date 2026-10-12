import { Align, ButtonGroupComponent, ButtonTypes, Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

interface ServiceProviderLinkInstancesActionsComponentProps {
  canSubmit: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const ServiceProviderLinkInstancesActionsComponent = ({
  canSubmit,
  onCancel,
  onSubmit,
}: ServiceProviderLinkInstancesActionsComponentProps) => (
  <ButtonGroupComponent align={Align.RIGHT}>
    <SimpleButton disabled={!canSubmit} type={ButtonTypes.BUTTON} onClick={onSubmit}>
      {t('Partners.linkInstances.submit')}
    </SimpleButton>
    <SimpleButton priority={Priorities.SECONDARY} type={ButtonTypes.BUTTON} onClick={onCancel}>
      {t('Partners.linkInstances.cancel')}
    </SimpleButton>
  </ButtonGroupComponent>
);

ServiceProviderLinkInstancesActionsComponent.displayName =
  'ServiceProviderLinkInstancesActionsComponent';

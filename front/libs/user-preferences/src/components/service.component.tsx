import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import { OnChange } from 'react-final-form-listeners';
import { useMediaQuery } from 'react-responsive';

import { ToggleInput } from '@fc/dsfr';

import { Service } from '../interfaces';
import { ServiceImageComponent } from './service-image.component';
import { ServiceSwitchLabelComponent } from './service-switch-label.component';

interface ServiceComponentProps {
  service: Service;
}

export const ServiceComponent: React.FC<ServiceComponentProps> = React.memo(
  ({ service }: ServiceComponentProps) => {
    const gtMobile = useMediaQuery({ query: '(min-width: 576px)' });
    const [isDisabled, setIsDisabled] = useState(!service.isChecked);

    // @NOTE declarative function
    /* istanbul ignore next */
    const labelCallback = useCallback(
      (checked: boolean) => (
        <ServiceSwitchLabelComponent checked={checked} serviceTitle={service.title} />
      ),
      [service.title],
    );

    // @NOTE declarative function
    /* istanbul ignore next */
    const onChangeHandler = useCallback((value: boolean) => {
      setIsDisabled(!value);
    }, []);

    return (
      <li
        className={classnames(
          'flex-start items-start fr-pt-2w fr-toggle--border-bottom',
          // class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          { disabled: isDisabled, 'flex-columns': gtMobile, 'flex-rows': !gtMobile },
        )}
        data-testid={`service-component-${service.name}`}>
        <ServiceImageComponent disabled={isDisabled} service={service} />
        <ToggleInput
          initialValue={service.isChecked}
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          label={labelCallback}
          legend={{ checked: 'Autorisé', unchecked: 'Bloqué' }}
          name={`idpList.${service.uid}`}
        />
        <OnChange name={`idpList.${service.uid}`}>{onChangeHandler}</OnChange>
      </li>
    );
  },
);

ServiceComponent.displayName = 'ServiceComponent';

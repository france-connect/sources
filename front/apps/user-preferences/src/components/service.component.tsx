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
  allowToBeUpdated?: boolean;
}

export const ServiceComponent: React.FC<ServiceComponentProps> = React.memo(
  ({ allowToBeUpdated, service }: ServiceComponentProps) => {
    const gtMobile = useMediaQuery({ query: '(min-width: 576px)' });
    const gtDesktop = useMediaQuery({ query: '(min-width: 992px)' });

    const [isDisabled, setIsDisabled] = useState(!service.isChecked);

    // @NOTE declarative function
    /* istanbul ignore next */
    const labelCallback = useCallback(
      (checked: boolean) => (
        <ServiceSwitchLabelComponent
          checked={checked}
          disabled={!allowToBeUpdated}
          serviceTitle={service.title}
        />
      ),
      [allowToBeUpdated, service.title],
    );

    // @NOTE declarative function
    /* istanbul ignore next */
    const onChangeHandler = useCallback((value: boolean) => {
      setIsDisabled(!value);
    }, []);

    return (
      <li
        className={classnames('flex-start items-start fr-pt-2w fr-toggle--border-bottom', {
          disabled: isDisabled,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'flex-columns': gtMobile,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'flex-rows': !gtMobile,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-pb-1w': gtDesktop,
        })}
        data-testid={`service-component-${service.name}`}>
        <ServiceImageComponent disabled={isDisabled} service={service} />
        <ToggleInput
          disabled={!allowToBeUpdated}
          initialValue={service.isChecked}
          label={labelCallback}
          legend={{ checked: 'Autorisé', unchecked: 'Bloqué' }}
          name={`idpList.${service.uid}`}
        />
        {/*
          @TODO find a way to remove OnChange
          Author: Matthieu
          Date: 06/10/2022
        */}
        {allowToBeUpdated && <OnChange name={`idpList.${service.uid}`}>{onChangeHandler}</OnChange>}
      </li>
    );
  },
);

ServiceComponent.defaultProps = {
  allowToBeUpdated: true,
};

ServiceComponent.displayName = 'ServiceComponent';

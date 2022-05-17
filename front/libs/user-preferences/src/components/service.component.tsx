import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import { OnChange } from 'react-final-form-listeners';
import { useMediaQuery } from 'react-responsive';

import { FieldSwitchComponent } from '@fc/backoffice';

import { Service } from '../interfaces';
import { ServiceImageComponent } from './service-image.component';
import { ServiceSwitchLabelComponent } from './service-switch-label.component';

interface ServiceComponentProps {
  className?: string | undefined;
  service: Service;
}

export const ServiceComponent: React.FC<ServiceComponentProps> = React.memo(
  ({ className, service }: ServiceComponentProps) => {
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
    const onChangeHandler = useCallback((value) => {
      setIsDisabled(!value);
    }, []);

    return (
      <li
        className={classnames(
          'ServiceComponent flex-start items-start',
          // class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          { disabled: isDisabled, 'flex-columns': gtMobile, 'flex-rows': !gtMobile },
          className,
        )}
        data-testid={`service-component-${service.name}`}>
        <ServiceImageComponent disabled={isDisabled} service={service} />
        <FieldSwitchComponent
          className={classnames({ mt8: !gtMobile })}
          label={labelCallback}
          legend={{ active: 'Autorisé', inactive: 'Bloqué' }}
          name={`idpList.${service.uid}`}
        />
        <OnChange name={`idpList.${service.uid}`}>{onChangeHandler}</OnChange>
      </li>
    );
  },
);

ServiceComponent.defaultProps = {
  className: undefined,
};

ServiceComponent.displayName = 'ServiceComponent';

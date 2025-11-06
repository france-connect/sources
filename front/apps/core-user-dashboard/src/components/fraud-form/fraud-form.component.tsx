import classnames from 'classnames';
import React from 'react';
import { Field, Form } from 'react-final-form';

import { TextAreaInputComponent, TextInputComponent } from '@fc/core-user-dashboard';
import { ButtonTypes, CheckboxInput, SimpleButton, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

import type { FraudFormValuesInterface } from '../../interfaces';
import styles from './fraud-form.module.scss';
import {
  inputAuthenticationEventIdConfig,
  inputEmailConfig,
  inputPhoneConfig,
  inputTextAreaDescriptionConfig,
} from './fraud-form-input.config';

interface FraudFormComponentProps {
  fraudSurveyOrigin: string;
  idpEmail?: string;
  commit: (args: FraudFormValuesInterface) => Promise<void>;
}

export const FraudFormComponent = React.memo(
  ({ commit, fraudSurveyOrigin, idpEmail }: FraudFormComponentProps) => {
    const [breakpointSm] = useStylesVariables(['breakpoint-sm']);
    const gtMobile = useStylesQuery({ minWidth: breakpointSm });

    const title = t('FraudForm.form.title');
    const mention = t('FraudForm.form.mention');
    const accept = t('FraudForm.form.accept');
    const report = t('FraudForm.form.report');

    return (
      <div
        className={classnames(styles.form, 'fr-mt-4w fr-mb-3w', {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-py-2w fr-px-2w': !gtMobile,

          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-py-6w fr-px-10w': gtMobile,
        })}>
        <Form
          initialValues={{
            authenticationEventId: undefined,
            contactEmail: idpEmail,
            fraudSurveyOrigin,
            idpEmail,
            phoneNumber: undefined,
          }}
          onSubmit={commit}>
          {({ handleSubmit, submitting }) => (
            <form data-testid="fraud-form" id="fraud-form-component" onSubmit={handleSubmit}>
              <h5 className="fr-mb-1w">{title}</h5>
              <p className="fr-text--sm">{mention}</p>
              <Field component="input" name="fraudSurveyOrigin" type="hidden" />
              <Field component="input" name="idpEmail" type="hidden" />
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <TextInputComponent {...inputAuthenticationEventIdConfig} />
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <TextInputComponent {...inputEmailConfig} />
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <TextInputComponent {...inputPhoneConfig} />
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <TextAreaInputComponent {...inputTextAreaDescriptionConfig} />
              <CheckboxInput label={accept} name="acceptTransmitData" />
              <div className="text-right">
                <SimpleButton
                  className="fr-mt-4w"
                  dataTestId="fraud-form-submit-button"
                  disabled={!!submitting}
                  size={Sizes.MEDIUM}
                  type={ButtonTypes.SUBMIT}>
                  {report}
                </SimpleButton>
              </div>
            </form>
          )}
        </Form>
      </div>
    );
  },
);

FraudFormComponent.displayName = 'FraudFormComponent';

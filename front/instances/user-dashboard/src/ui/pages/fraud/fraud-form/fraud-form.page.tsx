import { Helmet } from '@dr.pogodin/react-helmet';
import classnames from 'classnames';
import React from 'react';

import type { AccountContextState } from '@fc/account';
import { AccountContext } from '@fc/account';
import { MessageTypes, useSafeContext } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { FraudConfigInterface } from '@fc/core-user-dashboard';
import {
  AuthenticationEventIdCallout,
  FraudFormComponent,
  FraudFormIntroductionComponent,
  FraudOptions,
  FraudSurveyIntroductionComponent,
  useFraudFormApi,
  useGetFraudSurveyOrigin,
} from '@fc/core-user-dashboard';
import { AlertComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

export const FraudFormPage = React.memo(() => {
  const [breakpointLg] = useStylesVariables(['breakpoint-lg']);
  const gtDesktop = useStylesQuery({ minWidth: breakpointLg });

  const { userinfos } = useSafeContext<AccountContextState>(AccountContext);

  const fraudConfig = ConfigService.get<FraudConfigInterface>(FraudOptions.CONFIG_NAME);

  const fraudSurveyOrigin = useGetFraudSurveyOrigin(fraudConfig);

  const { commit, submitErrors, submitWithSuccess } = useFraudFormApi(fraudConfig);

  const shouldDisplayFraudForm = !!fraudSurveyOrigin || submitWithSuccess;

  const documentTitle = t('Fraud.formPage.documentTitle');
  const successText = t('Fraud.formPage.success');
  const confirmationText = t('Fraud.formPage.confirmation');
  const errorText = t('Fraud.formPage.error');

  return (
    <React.Fragment>
      <Helmet>
        <title>{documentTitle}</title>
      </Helmet>
      <div
        className={classnames('fr-m-auto fr-px-2w', {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mt-5w': !gtDesktop,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mt-8w': gtDesktop,
        })}
        id="page-container">
        {shouldDisplayFraudForm ? (
          <div>
            <FraudFormIntroductionComponent />
            {submitWithSuccess ? (
              <AlertComponent dataTestId="success-alert" type={MessageTypes.SUCCESS}>
                <p className="fr-alert__title">{successText}</p>
                <p>{confirmationText}</p>
              </AlertComponent>
            ) : (
              <React.Fragment>
                <FraudFormComponent
                  commit={commit}
                  fraudSurveyOrigin={fraudSurveyOrigin}
                  idpEmail={userinfos?.email}
                />
                {submitErrors && (
                  <AlertComponent size={Sizes.SMALL} type={MessageTypes.ERROR}>
                    <p className="fr-alert__title">{errorText}</p>
                  </AlertComponent>
                )}
                <AuthenticationEventIdCallout className="fr-mt-6w" />
              </React.Fragment>
            )}
          </div>
        ) : (
          <FraudSurveyIntroductionComponent />
        )}
      </div>
    </React.Fragment>
  );
});

FraudFormPage.displayName = 'FraudFormPage';

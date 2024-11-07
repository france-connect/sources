import classnames from 'classnames';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import type { AccountContextState } from '@fc/account';
import { AccountContext } from '@fc/account';
import { useSafeContext } from '@fc/common';
import { ConfigService } from '@fc/config';
import { AlertComponent, AlertTypes, Sizes } from '@fc/dsfr';
import { useStylesQuery, useStylesVariables } from '@fc/styles';
import type { FraudConfigInterface } from '@fc/user-dashboard';
import {
  AuthenticationEventIdCallout,
  FraudFormComponent,
  FraudFormIntroductionComponent,
  FraudOptions,
  FraudSurveyIntroductionComponent,
  useFraudFormApi,
  useGetFraudSurveyOrigin,
} from '@fc/user-dashboard';

export const FraudFormPage = React.memo(() => {
  const [breakpointLg] = useStylesVariables(['breakpoint-lg']);
  const gtDesktop = useStylesQuery({ minWidth: breakpointLg });

  const { userinfos } = useSafeContext<AccountContextState>(AccountContext);

  const fraudConfig = ConfigService.get<FraudConfigInterface>(FraudOptions.CONFIG_NAME);

  const fraudSurveyOrigin = useGetFraudSurveyOrigin(fraudConfig);

  const { commit, submitErrors, submitWithSuccess } = useFraudFormApi(fraudConfig);

  const shouldDisplayFraudForm = !!fraudSurveyOrigin || submitWithSuccess;

  return (
    <React.Fragment>
      <Helmet>
        <title>Signaler une usurpation</title>
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
              <AlertComponent dataTestId="success-alert" type={AlertTypes.SUCCESS}>
                <p className="fr-alert__title">Votre demande a bien été prise en compte</p>
                <p>
                  Vous allez recevoir un message de confirmation à l’adresse électronique indiquée
                  dans le formulaire de contact.
                </p>
              </AlertComponent>
            ) : (
              <React.Fragment>
                <FraudFormComponent
                  commit={commit}
                  fraudSurveyOrigin={fraudSurveyOrigin}
                  idpEmail={userinfos?.email}
                />
                {submitErrors && (
                  <AlertComponent size={Sizes.SMALL} type={AlertTypes.ERROR}>
                    <p className="fr-alert__title">Le message n&rsquo;a pas pu être envoyé</p>
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

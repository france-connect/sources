import React from 'react';

import { MessageTypes, Strings } from '@fc/common';
import { Routes } from '@fc/core-user-dashboard';
import { AccordionComponent, AlertComponent, ConnectTypes, LinkComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { LoginFormComponent } from '@fc/login-form';

import { useFraudLoginPage } from '../../../../hooks';
import { LoginLayout } from '../../../layouts';

export const FraudLoginPage = React.memo(() => {
  const { expanded, identityTheftReportRoute, search, toggleExpanded } = useFraudLoginPage();

  return (
    <LoginLayout documentTitle={t('Fraud.loginPage.documentTitle')} size={Sizes.SMALL}>
      <h1 className="fr-mb-5w">{t('Fraud.loginPage.title')}</h1>

      <AlertComponent
        className="fr-my-3w"
        dataTestId="AlertComponent-fraud-login-info"
        icon="fr-icon-lightbulb-fill"
        size={Sizes.MEDIUM}
        type={MessageTypes.INFO}>
        <p className="text-left">
          <b>{t('Fraud.loginPage.alertInfo')}</b>
        </p>
      </AlertComponent>

      <div className="fr-py-6w fr-px-6w fr-mb-6w fr-mt-4w fr-background-alt--grey">
        <h2>{t('Fraud.loginPage.subtitle')}</h2>
        <p className="fr-text--lead">{t('Fraud.loginPage.textLead')}</p>
        <LoginFormComponent
          showHelp
          className="flex-rows items-center"
          connectType={ConnectTypes.FRANCE_CONNECT}
          redirectUrl={`${Routes.FRAUD_FORM}${search}`}
        />
      </div>

      <AccordionComponent
        id="fraud-login-accordion"
        opened={expanded}
        title={t('Fraud.loginPage.accordion.title')}
        onClick={toggleExpanded}>
        <div className="text-left fr-p-2w fr-background-alt--grey">
          <p>
            <b>{t('Fraud.loginPage.accordion.paragraph1')}</b>
          </p>
          <p>
            <b>
              {t('Fraud.loginPage.accordion.paragraph2')}
              {Strings.WHITE_SPACE}
              <LinkComponent
                dataTestId="fraud-identity-theft-report-link"
                href={identityTheftReportRoute}
                label={t('Fraud.loginPage.accordion.reportForm')}
              />
            </b>
          </p>
        </div>
      </AccordionComponent>
    </LoginLayout>
  );
});

FraudLoginPage.displayName = 'FraudLoginPage';

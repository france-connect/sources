import classnames from 'classnames';
import React, { useCallback } from 'react';
import { useFormState } from 'react-final-form';

import { MessageTypes } from '@fc/common';
import { AlertComponent, ButtonTypes, SimpleButton, Sizes, ToggleInput } from '@fc/dsfr';

import { useUserPreferencesForm } from '../hooks';
import type { UserPreferencesDataInterface } from '../interfaces';
import { AllowFutureIdpSwitchLabelComponent } from './allow-future-idp-switch-label.component';
import { ServicesListComponent } from './services-list.component';
import styles from './user-preferences-form.module.scss';

interface UserPreferencesFormComponentProps {
  userPreferences: UserPreferencesDataInterface;
  submitWithSuccess: boolean;
}

export const UserPreferencesFormComponent: React.FC<UserPreferencesFormComponentProps> = React.memo(
  ({ submitWithSuccess, userPreferences }: UserPreferencesFormComponentProps) => {
    const { dirty, dirtyFields, hasValidationErrors, pristine, submitting } = useFormState();

    const showValidationErrors = hasValidationErrors ?? false;

    const showNotification = !(dirty ?? false) && submitWithSuccess;

    const isDisabled = (pristine ?? true) || (submitting ?? false) || showValidationErrors;

    const { alertInfoState, allowingIdPConfirmation } = useUserPreferencesForm({
      dirtyFields: dirtyFields ?? {},
      userPreferences,
    });

    const labelCallback = useCallback(
      (checked: boolean) => <AllowFutureIdpSwitchLabelComponent checked={checked} />,
      [],
    );

    return (
      <React.Fragment>
        <h1 className={classnames(styles.title, 'fr-h3 fr-mt-5w fr-mb-2w')}>Mes réglages</h1>
        <p className="fr-mt-2w">
          Attention&nbsp;:&nbsp;<strong>Vous devez avoir au moins un compte autorisé</strong> pour
          continuer à utiliser FranceConnect. Nous vous conseillons de ne bloquer que les comptes
          que vous n’utilisez pas.
        </p>
        <ServicesListComponent identityProviders={userPreferences.idpList} />

        {showValidationErrors && (
          <AlertComponent type={MessageTypes.ERROR}>
            <p className="fr-alert__title">
              Attention, vous devez avoir au moins un compte autorisé pour continuer à utiliser
              FranceConnect.
            </p>
            <p>
              Veuillez choisir au moins un compte autorisé pour pouvoir enregistrer vos réglages.
            </p>
          </AlertComponent>
        )}

        <p className="fr-my-5w">
          Il est possible que FranceConnect mette à votre disposition dans le futur de nouveaux
          comptes pour vous connecter à vos services.
          <strong> Par défaut leur utilisation sera autorisée.</strong>
          <br />
          Pour plus de sécurité, vous pouvez les bloquer dès maintenant et pourrez les autoriser à
          tout moment depuis cette page.
        </p>

        <ToggleInput
          initialValue={userPreferences.allowFutureIdp}
          label={labelCallback}
          legend={{ checked: 'Autorisé', unchecked: 'Bloqué' }}
          name="allowFutureIdp"
          onUpdate={allowingIdPConfirmation}
        />

        {alertInfoState.isDisplayedAlertInfo && (
          <AlertComponent className="fr-mt-2w" size={Sizes.SMALL}>
            <p data-testid="UserPreferenceFormComponent-title-info">
              Êtes-vous sûr de vouloir autoriser par défaut les futurs moyens de connexion ?
            </p>
            {/*
            @TODO [DARKMODE][DSFR]
            should be replaced by a managing darkmode DSFR component
            or by a DSFR color css  class
            */}
            <button
              className="is-underline no-padding"
              data-testid="UserPreferenceFormComponent-button-info"
              type="button"
              onClick={allowingIdPConfirmation}>
              Oui, je confirme.
            </button>
          </AlertComponent>
        )}

        <div className="text-center fr-mt-5w fr-mt-md-11w">
          <SimpleButton
            disabled={isDisabled || alertInfoState.isDisplayedAlertInfo}
            size={Sizes.LARGE}
            type={ButtonTypes.SUBMIT}>
            Enregistrer mes réglages
          </SimpleButton>
          {showNotification && (
            <p className="fr-mt-3v">
              Une notification récapitulant les modifications va vous être envoyée
            </p>
          )}
        </div>
      </React.Fragment>
    );
  },
);

UserPreferencesFormComponent.displayName = 'UserPreferencesFormComponent';

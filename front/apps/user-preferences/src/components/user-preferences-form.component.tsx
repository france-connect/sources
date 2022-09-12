import classnames from 'classnames';
import React, { FormEventHandler, useCallback } from 'react';
import { OnChange } from 'react-final-form-listeners';
import { useMediaQuery } from 'react-responsive';

import { AlertComponent, AlertTypes, SimpleButton, Sizes, ToggleInput } from '@fc/dsfr';

import { useUserPreferencesForm } from '../hooks';
import { UserPreferencesData } from '../interfaces';
import { AllowFutureIdpSwitchLabelComponent } from './allow-future-idp-switch-label.component';
import { ServicesListComponent } from './services-list.component';
import styles from './user-preferences-form.module.scss';

interface UserPreferencesFormComponentProps {
  dirtyFields: Record<string, boolean>;
  isDisabled: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  userPreferences: UserPreferencesData;
  showNotification: boolean;
  hasValidationErrors: boolean;
}

export const UserPreferencesFormComponent: React.FC<UserPreferencesFormComponentProps> = React.memo(
  ({
    dirtyFields,
    hasValidationErrors,
    isDisabled,
    onSubmit,
    showNotification,
    userPreferences,
  }: UserPreferencesFormComponentProps) => {
    const gtTablet = useMediaQuery({ minWidth: 768 });

    const { alertInfoState, allowingIdPConfirmation } = useUserPreferencesForm({
      dirtyFields,
      userPreferences,
    });

    const labelCallback = useCallback(
      (checked: boolean) => <AllowFutureIdpSwitchLabelComponent checked={checked} />,
      [],
    );

    return (
      <form
        data-testid="user-preferences-form"
        id="UserPreferencesFormComponent"
        onSubmit={onSubmit}>
        <h2 className={classnames(styles.title, 'fr-h3 fr-mt-5w fr-mb-2w')}>
          <b>Mes réglages&nbsp;:</b>
        </h2>
        <p className="fr-mt-2w">
          Attention&nbsp;:&nbsp;<strong>Vous devez avoir au moins un compte autorisé</strong> pour
          continuer à utiliser FranceConnect. Nous vous conseillons de ne bloquer que les comptes
          que vous n’utilisez pas.
        </p>
        <ServicesListComponent identityProviders={userPreferences.idpList} />

        {hasValidationErrors && (
          <AlertComponent type={AlertTypes.ERROR}>
            <p className="fr-alert__title">
              Attention, vous devez avoir au moins un compte autorisé pour continuer à utiliser
              FranceConnect.
            </p>
            <p>
              Veuillez choisir au moins un compte autorisé pour pouvoir enregistrer vos réglages.
            </p>
          </AlertComponent>
        )}

        <p className="fr-mt-5w">
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
        />
        <OnChange name="allowFutureIdp">{allowingIdPConfirmation}</OnChange>

        {alertInfoState.isDisplayedAlertInfo && (
          <AlertComponent size={Sizes.SMALL}>
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

        <div
          className={classnames('text-center', {
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mt-11w': gtTablet,
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mt-5w': !gtTablet,
          })}>
          <SimpleButton
            disabled={isDisabled || alertInfoState.isDisplayedAlertInfo}
            label="Enregistrer mes réglages"
            size={Sizes.LARGE}
            type="submit"
          />
          {showNotification && (
            <p className="fr-mt-3v">
              Une notification récapitulant les modifications va vous être envoyée
            </p>
          )}
        </div>
      </form>
    );
  },
);

UserPreferencesFormComponent.displayName = 'UserPreferencesFormComponent';

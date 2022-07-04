import classnames from 'classnames';
import { ValidationErrors } from 'final-form';
import React, { FormEventHandler } from 'react';
import { useMediaQuery } from 'react-responsive';

import { AlertMessageComponent, CheckboxInput, SimpleButton, Sizes } from '@fc/dsfr';

import { UserPreferencesData } from '../interfaces';
import { ServicesListComponent } from './services-list.component';
import styles from './user-preferences-form.module.scss';

interface UserPreferencesFormComponentProps {
  errors: ValidationErrors;
  isDisabled: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  userPreferences: UserPreferencesData | undefined;
  showNotification: boolean;
  hasValidationErrors: boolean;
}

export const UserPreferencesFormComponent: React.FC<UserPreferencesFormComponentProps> = React.memo(
  ({
    errors,
    hasValidationErrors,
    isDisabled,
    onSubmit,
    showNotification,
    userPreferences,
  }: UserPreferencesFormComponentProps) => {
    const gtTablet = useMediaQuery({ query: 'min-width(768px)' });
    const showServicesList =
      userPreferences && userPreferences.idpList && userPreferences.idpList.length > 0;
    return (
      <form
        data-testid="user-preferences-form"
        id="UserPreferencesFormComponent"
        onSubmit={onSubmit}>
        <h2 className={classnames(styles.title, 'fr-h3 fr-mt-5w')}>
          <b>Mes réglages&nbsp;:</b>
        </h2>
        <p className="fr-mt-2w">
          Attention&nbsp;:&nbsp;<strong>Vous devez avoir au moins un compte autorisé</strong> pour
          continuer à utiliser FranceConnect. Nous vous conseillons de ne bloquer que les comptes
          que vous n’utilisez pas.
        </p>
        {showServicesList && <ServicesListComponent identityProviders={userPreferences.idpList} />}

        {hasValidationErrors && (
          <AlertMessageComponent
            closable={errors?.closable}
            description={errors?.description}
            size={errors?.size}
            title={errors?.title}
            type={errors?.type}
          />
        )}

        <p className="fr-mt-5w">
          Pour vous offrir toujours plus de choix, il est possible que FranceConnect mette à votre
          disposition de nouveaux moyens d’identification dans le futur. En cochant cette case, ils
          ne pourront pas être utilisés pour accéder aux services proposant FranceConnect.
        </p>
        <p className="fr-mt-2w">Vous pourrez les autoriser depuis cette page.</p>
        <CheckboxInput
          label="Bloquer par défaut les nouveaux moyens de connexion dans FranceConnect"
          name="allowFutureIdp"
        />
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
            disabled={isDisabled}
            label="Enregistrer mes réglages"
            size={Sizes.MEDIUM}
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

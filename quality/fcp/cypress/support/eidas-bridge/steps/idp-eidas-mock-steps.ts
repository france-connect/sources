import { When } from 'cypress-cucumber-preprocessor/steps';

import { EidasAssuranceLevelEnum, EuIdpLoginCancelStepEnum } from '../enums';
import IdpEidasMockPage from '../pages/idp-eidas-mock-page';

const idpEidasMockPage = new IdpEidasMockPage();

When(
  "je m'authentifie avec succès sur le fournisseur d'identité étranger",
  function () {
    idpEidasMockPage.authenticateToEUIdp();
  },
);

When(
  "je m'authentifie avec succès sur le fournisseur d'identité étranger avec un niveau de garantie {string}",
  function (assuranceLevel: string) {
    const loa: EidasAssuranceLevelEnum =
      EidasAssuranceLevelEnum[assuranceLevel];
    expect(loa, `The level of assurance '${assuranceLevel}' doesn't exist`).to
      .exist;
    idpEidasMockPage.authenticateToEUIdp({ loa });
  },
);

When(
  /^j'annule l'authentification sur le fournisseur d'identité étranger lors (?:du|de la) "(consentement des attributs obligatoires|consentement des attributs optionnels|confirmation du consentement)"$/,
  function (cancelStep: string) {
    const cancelStepMap = {
      'confirmation du consentement': EuIdpLoginCancelStepEnum.Confirmation,
      'consentement des attributs obligatoires':
        EuIdpLoginCancelStepEnum.MandatoryAttributes,
      'consentement des attributs optionnels':
        EuIdpLoginCancelStepEnum.OptionalAttributes,
    };
    const cancel: EuIdpLoginCancelStepEnum = cancelStepMap[cancelStep];
    expect(cancel, `The cancel step '${cancelStep}' doesn't exist`).to.exist;
    idpEidasMockPage.authenticateToEUIdp({ cancel });
  },
);

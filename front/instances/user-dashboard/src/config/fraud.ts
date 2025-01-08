import type { FraudConfigInterface } from '@fc/user-dashboard';

export const Fraud: FraudConfigInterface = {
  apiRouteFraudForm: `/api/fraud-form`,
  fraudSupportFormPathname: '/usurpation',
  fraudSurveyUrl: 'https://aide.franceconnect.gouv.fr/erreurs/signalement/etape-1/',
  supportFormUrl: 'https://app.franceconnect.gouv.fr/support/formulaire',
  surveyOriginQueryParam: 'fraudSurveyOrigin',
};

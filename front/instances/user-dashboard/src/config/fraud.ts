import type { FraudConfigInterface } from '@fc/core-user-dashboard';

export const Fraud: FraudConfigInterface = {
  apiRouteFraudForm: `/api/fraud-form`,
  apiRouteFraudGetTracks: '/api/fraud/data/tracks',
  fraudSupportFormPathname: '/usurpation',
  fraudSurveyUrl: 'https://aide.franceconnect.gouv.fr/erreurs/signalement/etape-1/',
  identityTheftReportRoute: '/signalement-usurpation/description-usurpation',
  surveyOriginQueryParam: 'fraudSurveyOrigin',
};

/**
 * @NOTE the presence of fraudSurveyOrigin as a query param is temporary
 * the duplication of the routes '/fraud/form' is therefore going to disappear
 */
export enum UserDashboardFrontRoutes {
  HISTORY = '/history',
  PREFERENCES = '/preferences',
  FRAUD_FORM = '/fraud/form',
  FRAUD_FORM_KNOWN = '/fraud/form?fraudSurveyOrigin=identite-connue',
  FRAUD_FORM_UNKNOWN = '/fraud/form?fraudSurveyOrigin=identite-inconnue',
  INDEX = '/',
}

/* istanbul ignore file */

export enum ServiceProviderStatusColors {
  SANDBOX = 'yellow-tournesol',
  REVIEW_REQUESTED = 'green-archipel',
  REVIEW_IN_PROGRESS = 'green-menthe',
  REVIEW_VALIDATED = 'green-emeraude',
  REVIEW_WAITING_CLIENT_FEEDBACK = 'orange-terre-battue',
  REVIEW_REFUSED = 'error',
  PRODUCTION_ACCESS_PENDING = 'orange-terre-battue',
  PRODUCTION_READY = 'blue-cumulus',
  PRODUCTION_LIVE = 'green-emeraude',
  ARCHIVED = 'grey',
}

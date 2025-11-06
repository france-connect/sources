export const LoginFormComponent = jest.fn(() => <div data-mockid="LoginFormComponent" />);

export const FraudFormComponent = jest.fn(() => <div data-mockid="FraudFormComponent" />);

export const TextInputComponent = jest.fn(() => <div>TextInputComponent</div>);
export const TextAreaInputComponent = jest.fn(() => <div>TextAreaInputComponent</div>);

export const AuthenticationEventIdCallout = jest.fn(() => <div>AuthenticationEventIdCallout</div>);

export const FraudFormIntroductionComponent = jest.fn(() => (
  <div>FraudFormIntroductionComponent</div>
));

export const FraudSurveyIntroductionComponent = jest.fn(() => (
  <div>FraudSurveyIntroductionComponent</div>
));

export const IdentityTheftReportFormComponent = jest.fn(() => (
  <div data-mockid="IdentityTheftReportFormComponent" />
));

export const IdentityTheftReportNoTracksFound = jest.fn(() => (
  <div data-mockid="IdentityTheftReportNoTracksFound" />
));

export const IdentityTheftReportConnectionListActionsComponent = jest.fn(() => (
  <div data-mockid="IdentityTheftReportConnectionListActionsComponent" />
));

export const IdentityTheftReportHelpEventIdAccordionComponent = jest.fn(() => (
  <div data-mockid="IdentityTheftReportHelpEventIdAccordionComponent" />
));

export const IdentityTheftReportTracksComponent = jest.fn(() => (
  <div data-mockid="IdentityTheftReportTracksComponent" />
));

export const UserPreferencesIntroductionComponent = jest.fn(() => (
  <div>UserPreferencesIntroductionComponent</div>
));

export const SessionExpiredAlertComponent = jest.fn(() => (
  <div data-mockid="SessionExpiredAlertComponent" />
));

export const TrackCardComponent = jest.fn(() => <div data-mockid="TrackCardComponent" />);

export const useFraudFormApi = jest.fn();

export const useGetFraudSurveyOrigin = jest.fn();

export const composeValidators = jest.fn();

export const redirectToFraudSurvey = jest.fn();

export const mustBeEmail = jest.fn();

export const mustBeFilled = jest.fn();

export const mustBePhone = jest.fn();

export const mustBeUUIDv4 = jest.fn();

export const FraudOptions = {
  CONFIG_NAME: 'Fraud',
  SURVEY_ORIGIN_UNKOWN: 'unknown',
};

export const Routes = {
  FRAUD_FORM: '/fraud/form',
  FRAUD_LOGIN: '/fraud',
  HISTORY: '/history',
  PREFERENCES: '/preferences',
};

export const LoginFormComponent = jest.fn(() => <div data-mockid="LoginFormComponent" />);

// @TODO to be removed when input has been moved into libs/forms
export const FraudFormComponent = jest.fn(() => <div>FraudFormComponent</div>);
export const TextInputComponent = jest.fn(() => <div>TextInputComponent</div>);
export const TextAreaInputComponent = jest.fn(() => <div>TextAreaInputComponent</div>);

export const AuthenticationEventIdCallout = jest.fn(() => <div>AuthenticationEventIdCallout</div>);

export const FraudFormIntroductionComponent = jest.fn(() => (
  <div>FraudFormIntroductionComponent</div>
));

export const FraudSurveyIntroductionComponent = jest.fn(() => (
  <div>FraudSurveyIntroductionComponent</div>
));

export const getFraudSupportFormUrl = jest.fn();

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

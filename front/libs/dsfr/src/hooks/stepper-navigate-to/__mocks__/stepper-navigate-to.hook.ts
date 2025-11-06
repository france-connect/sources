export const useStepperNavigateTo = jest.fn(() => ({
  gotoNextStep: jest.fn(),
  gotoPreviousStep: jest.fn(),
  navigateTo: jest.fn(),
}));

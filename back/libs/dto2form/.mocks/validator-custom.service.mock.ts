export function getValidatorCustomServiceMock() {
  return {
    validator1: jest.fn(),
    validator2: jest.fn(),
    validator3: jest.fn(),
    validator4: jest.fn(),
    isNotEmpty: jest.fn(),
    isEqualToConfig: jest.fn(),
  };
}

export const parseInitialValues = jest.fn();

export const Dto2InputComponent = jest.fn(() => <div data-mockid="Dto2InputComponent" />);

export const Dto2FormComponent = jest.fn(() => <div data-mockid="Dto2FormComponent" />);

export const Dto2FormService = {
  commit: jest.fn(),
  get: jest.fn(),
};

export const useSubmitHandler = jest.fn();

export const removeEmptyValues = jest.fn();

export const loadData = jest.fn();

export const Dto2FormOptions = {
  CONFIG_NAME: 'Dto2Form',
};

const actualModule = jest.requireActual('react-final-form-arrays');

module.exports = {
  ...actualModule,
  FieldArray: jest.fn(({ children, ...rest }) => children(rest)),
  useFieldArray: jest.fn(),
};

export {};

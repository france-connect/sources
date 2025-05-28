const actualModule = jest.requireActual('react-final-form');

module.exports = {
  ...actualModule,
  Field: jest.fn(({ children, ...rest }) => {
    if (children) {
      return children(rest);
    }
    return <div data-mockid="Field" />;
  }),
  Form: jest.fn(({ children, ...rest }) => children(rest)),
  FormSpy: jest.fn(),
  useField: jest.fn(),
};

export {};

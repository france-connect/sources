const actualModule = jest.requireActual('react-final-form');

module.exports = {
  ...actualModule,
  Field: jest.fn(({ children, ...rest }) => children(rest)),
  Form: jest.fn(({ children, ...rest }) => children(rest)),
};

export {};

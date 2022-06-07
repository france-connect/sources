const actualModule = jest.requireActual('react-final-form-listeners');

module.exports = {
  ...actualModule,
  OnChange: jest.fn(() => <div>OnChange</div>),
};

export {};

const actualModule = jest.requireActual('react-final-form-listeners');

module.exports = {
  _esModule: true,
  ...actualModule,
  OnChange: jest.fn(() => <div>OnChange</div>),
};

export {};

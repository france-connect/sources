const actualModule = jest.requireActual('react-responsive');

module.exports = {
  _esModule: true,
  ...actualModule,
  useMediaQuery: jest.fn(() => true),
};

export {};

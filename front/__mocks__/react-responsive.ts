const actualModule = jest.requireActual('react-responsive');

module.exports = {
  ...actualModule,
  useMediaQuery: jest.fn(() => true),
};

export {};

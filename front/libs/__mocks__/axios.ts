const actualModule = jest.requireActual('axios');

module.exports = {
  _esModule: true,
  ...actualModule,
  get: jest.fn(() => Promise.resolve(null)),
  post: jest.fn(() => Promise.resolve(null)),
};

export {};

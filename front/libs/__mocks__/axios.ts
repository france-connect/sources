const actualModule = jest.requireActual('axios');

module.exports = {
  ...actualModule,
  get: jest.fn(() => Promise.resolve(null)),
  post: jest.fn(() => Promise.resolve(null)),
};

export {};

const actualModule = jest.requireActual('axios');

module.exports = {
  ...actualModule,
  get: jest.fn(() => Promise.resolve(null)),
  interceptors: {
    request: {
      eject: jest.fn(),
      use: jest.fn(),
    },
    response: {
      eject: jest.fn(),
      use: jest.fn(),
    },
  },
  post: jest.fn(() => Promise.resolve(null)),
  request: jest.fn(() => Promise.resolve(null)),
};

export {};

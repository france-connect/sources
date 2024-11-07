const actualModule = jest.requireActual('validator');

module.exports = {
  ...actualModule,
  isEmail: jest.fn(),
  isUUID: jest.fn(),
};

export {};

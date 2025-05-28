const actualModule = jest.requireActual('validator');

module.exports = {
  ...actualModule,
  isEmail: jest.fn(),
  isIP: jest.fn(),
  isIPRange: jest.fn(),
  isURL: jest.fn(),
  isUUID: jest.fn(),
};

export {};

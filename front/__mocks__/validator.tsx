const actualModule = jest.requireActual('validator');

module.exports = {
  ...actualModule,
  isEmail: jest.fn(),
  isUUID: jest.fn(),
  isIP: jest.fn(),
  isURL: jest.fn(),
  isIPRange: jest.fn(),
};

export {};

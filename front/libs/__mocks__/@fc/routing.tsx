const actualModule = jest.requireActual('@fc/routing');

module.exports = {
  _esModule: true,
  ...actualModule,
  RoutesManagerComponent: jest.fn(() => <div>RoutesManagerComponent</div>),
};

export {};

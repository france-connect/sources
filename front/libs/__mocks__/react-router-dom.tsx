const actualModule = jest.requireActual('react-router-dom');

module.exports = {
  _esModule: true,
  ...actualModule,
  Link: jest.fn(({ children }) => <div>{children}</div>),
  NavLink: jest.fn(({ children }) => <div>{children}</div>),
  Redirect: jest.fn(() => <div>Redirect</div>),
};

export {};

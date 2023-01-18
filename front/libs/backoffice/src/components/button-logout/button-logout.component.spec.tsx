import { render } from '@testing-library/react';
import { useContext } from 'react';

import { useApiGet } from '@fc/common';

import { ButtonLogoutComponent } from './button-logout.component';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

jest.mock('@fc/common');

describe('ButtonLogoutComponent', () => {
  const useContextMock = jest.mocked(useContext);
  const useApiGetMock = jest.mocked(useApiGet);
  const logoutUrlMock = 'logoutUrlMock value';
  const contextMock = {
    state: { config: { OidcClient: { endpoints: { getEndSessionUrl: 'foo' } } } },
  };

  beforeEach(() => {
    useContextMock.mockReturnValue(contextMock);
    useApiGetMock.mockReturnValue(logoutUrlMock);
  });

  it('should render a link with text', () => {
    // setup
    const { getByText } = render(<ButtonLogoutComponent />);
    // action
    const span = getByText('Se déconnecter');
    // expect
    expect(span).toBeInTheDocument();
  });

  it('should render a logout link', () => {
    // setup
    const { container } = render(<ButtonLogoutComponent />);
    // action
    const link = container.getElementsByTagName('a');
    // expect
    expect(link).toHaveLength(1);
    expect(link[0]).toHaveAttribute('href', logoutUrlMock);
  });
});

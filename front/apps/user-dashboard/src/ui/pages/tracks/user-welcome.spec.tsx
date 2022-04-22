import { render } from '@testing-library/react';

import { UserInfosContext } from '@fc/oidc-client';

import { UserWelcomeComponent } from './user-welcome';

describe('UserWelcomeComponent', () => {
  // given
  const userinfosMockValue = {
    connected: true,
    ready: true,
    userinfos: {
      birthcountry: '',
      birthdate: '',
      birthplace: '',
      email: '',
      // OIDC defined name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      family_name: 'Doe',
      gender: '',
      // OIDC defined name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'John',
      sub: '',
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // setup
    const { container } = render(<UserWelcomeComponent />);
    // expect
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render username', () => {
    // setup
    const { getByText } = render(
      <UserInfosContext.Provider value={userinfosMockValue}>
        <UserWelcomeComponent />
      </UserInfosContext.Provider>,
    );
    // action
    const username = getByText('John Doe');
    // expect
    expect(username).toBeInTheDocument();
  });
});

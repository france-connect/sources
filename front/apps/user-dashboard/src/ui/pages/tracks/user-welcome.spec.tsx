import { render } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { UserinfosInterface, useUserinfos } from '@fc/oidc-client';

import { UserWelcomeComponent } from './user-welcome';

jest.mock('@fc/oidc-client');

describe('UserWelcomeComponent', () => {
  const useUserinfosMock = mocked(useUserinfos);

  const userinfosMockValue = {
    connected: true,
    userinfos: {
      // OIDC defined name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      family_name: 'Doe',
      // OIDC defined name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'John',
    } as unknown as UserinfosInterface,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    useUserinfosMock.mockReturnValue(userinfosMockValue);
  });

  it('should render something', () => {
    // setup
    const { getByText } = render(<UserWelcomeComponent />);
    // action
    const title = getByText('Bienvenue');
    const username = getByText('John Doe');
    // expect
    expect(title).toBeInTheDocument();
    expect(username).toBeInTheDocument();
  });
});

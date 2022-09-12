/* istanbul ignore file */

// @TODO should be reimplemented while login feature
import React, { useCallback, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AccountContext, AccountInterface } from '@fc/account';
import { SimpleButton } from '@fc/dsfr';
import * as HttpClientService from '@fc/http-client';

interface LoginCredentialsInterface {
  email: string;
  password: string;
}

interface DataInterface {
  data: LoginCredentialsInterface;
}

export const LoginPage = React.memo(() => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const history = useHistory();
  const { updateAccount } = useContext<AccountInterface>(AccountContext);

  const onApiSuccess = useCallback(
    ({ data }: DataInterface) => {
      history.push('/service-providers');
      updateAccount({ connected: true, ready: true, userinfos: data });
    },
    [updateAccount, history],
  );

  const onApiError = useCallback((err: Error) => {
    // eslint-disable-next-line no-console
    console.log('LoginPage.onApiError', err);
  }, []);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const credentials = { email, password };
      HttpClientService.post('/api/login', credentials).then(onApiSuccess).catch(onApiError);
    },
    [email, password, onApiError, onApiSuccess],
  );

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  return (
    <div className="content-wrapper-lg text-center fr-mt-8w" id="page-container">
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            style={{ border: 'solid' }}
            type="text"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            style={{ border: 'solid' }}
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <SimpleButton label="Login" type="submit" />
      </form>
    </div>
  );
});

LoginPage.displayName = 'LoginPage';

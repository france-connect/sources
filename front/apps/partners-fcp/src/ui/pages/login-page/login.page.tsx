/* istanbul ignore file */

// @TODO should be reimplemented while login feature
import axios from 'axios';
import React, { useCallback, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AccountContext, AccountInterface } from '@fc/account';
import { SimpleButton } from '@fc/dsfr';

interface LoginCredentialsInterface {
  email: string;
  password: string;
}

interface DataInterface {
  data: LoginCredentialsInterface;
}

const encodeFormData = ({ email, password }: LoginCredentialsInterface) => {
  const formData = new URLSearchParams();
  formData.append('email', email.toString());
  formData.append('password', password.toString());
  return formData;
};

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

  const onApiError = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('error');
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: LoginCredentialsInterface = { email, password };
    const dataEncoded = encodeFormData(data);

    axios.post('/api/login', dataEncoded).then(onApiSuccess).catch(onApiError);
  };

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

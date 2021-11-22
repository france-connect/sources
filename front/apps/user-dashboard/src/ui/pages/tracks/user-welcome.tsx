import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import { TracksConfig } from '../../../config';

import './user-welcome.scss';

interface userInfos {
  familyName: string;
  givenName: string;
}
interface userInfosResponseData {
  userInfos: userInfos;
}

export const UserWelcomeComponent = () => {
  const isMounted = useRef(false);
  const [userInfos, setUserInfos] = useState({
    familyName: '',
    givenName: '',
  });

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      axios
        .get<userInfosResponseData>(TracksConfig.API_ROUTE_USER_INFOS)
        .then((response) => {
          setUserInfos(response.data.userInfos);
        });
    }
  });

  return (
    <section className="welcome  text-center mb40">
      <h4>Bienvenue</h4>
      <h2 className="is-blue-france">
        <b>
          {userInfos.givenName} {userInfos.familyName}
        </b>
      </h2>
    </section>
  );
};

UserWelcomeComponent.displayName = 'UserWelcomeComponent';

import { useEffect, useState } from 'react';

import { useApiGet } from '@fc/common';

type useReturnButtonProps = {
  historyBackURL: string;
  serviceProviderName: string;
  showButton: boolean;
};

type ReturnButtonApiResponse = {
  redirectURI: string;
  redirectURIQuery: {};
  spName: string;
};

export const useReturnButton = (): useReturnButtonProps => {
  const data = useApiGet<ReturnButtonApiResponse>({
    endpoint: '/api/v2/history-back-url',
  });

  const [state, setState] = useState({
    historyBackURL: '/',
    serviceProviderName: '',
    showButton: false,
  });

  useEffect(() => {
    if (data) {
      const { redirectURI, redirectURIQuery, spName: serviceProviderName } = data;
      const query = new URLSearchParams(redirectURIQuery);
      const historyBackURL = `${redirectURI}?${query.toString()}`;
      setState({ historyBackURL, serviceProviderName, showButton: true });
    }
  }, [data]);

  return state;
};

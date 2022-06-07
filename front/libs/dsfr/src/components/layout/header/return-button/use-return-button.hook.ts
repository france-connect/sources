import { useEffect, useState } from 'react';

import { useApiGet } from '@fc/common';

interface useReturnButtonProps {
  historyBackURL: string;
  serviceProviderName: string;
  showButton: boolean;
}

interface ReturnButtonApiResponse {
  redirectURI: string;
  redirectURIQuery: Record<string, string>;
  spName: string;
}

export const useReturnButton = (endpoint: string): useReturnButtonProps => {
  const data = useApiGet<ReturnButtonApiResponse>({
    endpoint,
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

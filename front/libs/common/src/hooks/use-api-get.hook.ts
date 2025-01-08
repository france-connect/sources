// AppContext + useApiGet should be merged
// the axios wrapper might not be a hook but a function
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { get } from '@fc/http-client';

interface UseApiGetOptionsInterface {
  endpoint: string;
  errorPath?: string;
}

export class ApiException extends Error {}

export const useApiGet = <T>(
  { endpoint, errorPath }: UseApiGetOptionsInterface,
  callback?: Function,
) => {
  const navigate = useNavigate();
  const [data, setData] = useState<T>(undefined as unknown as T);

  const fetchData = useCallback(async () => {
    try {
      const response = await get<T>(endpoint);
      setData(response.data);
      callback?.(response.data);
    } catch (error: unknown) {
      if (errorPath) {
        // @TODO a supprimer lorsque le gestionnaire d'erreurs REACT sera implémenté
        // @SEE issues
        // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/715
        // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/781
        navigate(errorPath, { replace: true });
      }
    }
  }, [endpoint, errorPath, navigate, callback]);

  useEffect(() => {
    fetchData();
    // @NOTE should be called only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data;
};

/* istanbul ignore file */

// @NOTE refacto needed
// AppContext + useApiGet should be merged
// the axios wrapper might not be a hook but a function
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface UseApiGetOptionsInterface {
  endpoint: string;
  errorPath?: string;
}

export class ApiException extends Error {}

// @TODO remove this and replace in apps by http-client
export const useApiGet = <T>(
  { endpoint, errorPath }: UseApiGetOptionsInterface,
  callback?: Function,
) => {
  const history = useHistory();
  const isMounted = useRef(false);
  const [data, setData] = useState<T>(undefined as unknown as T);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get<T>(endpoint);
      setData(response.data);
      callback?.(response.data);
    } catch (error: unknown) {
      if (errorPath) {
        // @TODO a supprimer lorsque le gestionnaire d'erreurs REACT sera implémenté
        // @SEE issues
        // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/715
        // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/781
        history.replace(errorPath);
      }
    }
  }, [endpoint, errorPath, history, callback]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetchData();
    }
  }, [fetchData]);

  return data;
};

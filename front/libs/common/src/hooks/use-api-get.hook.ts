/* istanbul ignore file */

// @NOTE refacto needed
// AppContext + useApiGet should be merged
// the axios wrapper might not be a hook but a function
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface UseApiGetOptionsInterface {
  endpoint: string;
}

export class ApiException extends Error {}

export const useApiGet = <T>({ endpoint }: UseApiGetOptionsInterface, callback?: Function) => {
  const mounted = useRef(false);
  const [data, setData] = useState<T>(undefined as unknown as T);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      axios
        .get<T>(endpoint)
        .then((response) => {
          setData(response.data);
          callback?.(response.data);
        })
        .catch((error) => {
          throw new ApiException(error);
        });
    }
  });

  return data;
};

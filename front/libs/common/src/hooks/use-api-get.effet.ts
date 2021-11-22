import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface useApiGetOptionsInterface {
  endpoint: string;
}

export class ApiException extends Error {}

export const useApiGet = <T>(
  { endpoint }: useApiGetOptionsInterface,
  callback?: Function,
) => {
  const mounted = useRef(false);
  const [data, setData] = useState<T>(undefined as unknown as T);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;

      axios
        .get<T>(endpoint)
        .then((response) => {
          setData(response.data);
          callback && callback(response.data);
        })
        .catch((error) => {
          throw new ApiException(error);
        });
    }
  });

  return data;
};

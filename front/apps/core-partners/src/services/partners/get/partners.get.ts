import { HttpStatusCode } from 'axios';
import { redirect } from 'react-router';

import type { AxiosException } from '@fc/http-client';
import { get as httpClientGet } from '@fc/http-client';
import { AuthFallbackRoutes } from '@fc/routing';

export const get = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await httpClientGet<T>(url);
    return response.data;
  } catch (err) {
    const { status } = err as AxiosException;

    if (status === HttpStatusCode.Forbidden) {
      return null;
    }

    if (status === HttpStatusCode.Unauthorized) {
      redirect(AuthFallbackRoutes.LOGIN, HttpStatusCode.Unauthorized);
      return null;
    }

    throw err;
  }
};

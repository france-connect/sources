import { HttpStatusCode } from 'axios';
import { redirect } from 'react-router';

import { AuthFallbackRoutes } from '@fc/routing';

import type { AxiosException } from '../errors';
import { get } from '../services';

export const fetchWithAuthHandling = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await get<T>(url);
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

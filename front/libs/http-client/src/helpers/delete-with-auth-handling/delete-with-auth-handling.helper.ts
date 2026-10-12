import { HttpStatusCode } from 'axios';
import { redirect } from 'react-router';

import { AuthFallbackRoutes } from '@fc/routing';

import type { AxiosException } from '../../errors';
import type { HttpClientDataInterface } from '../../interfaces';
import { del } from '../../services';

export const deleteWithAuthHandling = async <T>(
  url: string,
  data?: HttpClientDataInterface,
): Promise<T | null> => {
  try {
    const response = await del<T>(url, data);
    return response.data;
  } catch (err) {
    const { status } = err as AxiosException;

    if (status === HttpStatusCode.Unauthorized) {
      redirect(AuthFallbackRoutes.LOGIN, HttpStatusCode.Unauthorized);
      return null;
    }

    throw err;
  }
};

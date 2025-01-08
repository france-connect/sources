import { HttpStatusCode } from '@fc/common';
import type { AxiosException } from '@fc/http-client';
import { get as httpClientGet } from '@fc/http-client';

export const get = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await httpClientGet<T>(url);
    return response.data;
  } catch (err) {
    const { status } = err as AxiosException;

    if (status === HttpStatusCode.FORBIDDEN) {
      return null;
    }

    throw err;
  }
};

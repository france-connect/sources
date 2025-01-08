import { ContentType, type HttpMethods } from '@fc/common';
import { UNKNOWN_FORM_ERROR } from '@fc/forms';
import type { HttpClientDataInterface } from '@fc/http-client';
import { getCSRF, makeRequest } from '@fc/http-client';

export const commit = async (
  method: HttpMethods.PUT | HttpMethods.POST,
  url: string,
  data: HttpClientDataInterface,
) => {
  try {
    // @TODO should use a @fc/http-client.put
    // create a ticket
    const { csrfToken } = await getCSRF();
    const datas = { ...data, csrfToken };
    return await makeRequest(method, url, datas, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': ContentType.FORM_URL_ENCODED,
      },
    });
  } catch (err) {
    return UNKNOWN_FORM_ERROR;
  }
};

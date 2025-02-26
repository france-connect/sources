import type { AxiosError } from 'axios';
import { HttpStatusCode } from 'axios';
import type { SubmissionErrors } from 'final-form';

import { ContentType, type HttpMethods } from '@fc/common';
import type { ResponseErrorInterface } from '@fc/dto2form';
import { UNKNOWN_FORM_ERROR } from '@fc/forms';
import type { HttpClientDataInterface } from '@fc/http-client';
import { getCSRF, makeRequest } from '@fc/http-client';

import type { VersionInterface } from '../../../interfaces';

export const commit = async (
  method: HttpMethods.PUT | HttpMethods.POST,
  url: string,
  data: HttpClientDataInterface,
): Promise<SubmissionErrors> => {
  try {
    const { csrfToken } = await getCSRF();
    const datas = { ...data };
    await makeRequest<VersionInterface>(method, url, datas, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': ContentType.FORM_URL_ENCODED,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'x-csrf-token': csrfToken,
      },
    });
    return undefined;
  } catch (err) {
    const error = err as AxiosError<ResponseErrorInterface>;

    const isDTO2FormError = error.response?.status === HttpStatusCode.UnprocessableEntity;
    const dto2FormErrors = error.response?.data.payload;

    const isUndefinedError = !isDTO2FormError || !dto2FormErrors;
    if (isUndefinedError) {
      return UNKNOWN_FORM_ERROR;
    }

    return dto2FormErrors;
  }
};

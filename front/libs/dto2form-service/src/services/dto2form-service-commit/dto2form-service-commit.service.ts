import type { AxiosError } from 'axios';
import { HttpStatusCode } from 'axios';
import { FORM_ERROR, type SubmissionErrors } from 'final-form';

import { ContentType, type HttpMethods } from '@fc/common';
import type { ResponseErrorInterface } from '@fc/dto2form';
import type { HttpClientDataInterface } from '@fc/http-client';
import { getCSRF, makeRequest } from '@fc/http-client';
import { t } from '@fc/i18n';

export const dto2FormServiceCommit = async <T>(
  method: HttpMethods,
  url: string,
  data: HttpClientDataInterface,
): Promise<SubmissionErrors> => {
  try {
    const { csrfToken } = await getCSRF();
    const datas = { ...data };
    await makeRequest<T>(method, url, datas, {
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

    const isDto2FormError = error.response?.status === HttpStatusCode.UnprocessableEntity;
    const dto2FormErrors = error.response?.data.payload;

    const isUndefinedError = !isDto2FormError || !dto2FormErrors;
    if (isUndefinedError) {
      return {
        [FORM_ERROR]: t('Form.FORM_ERROR'),
      };
    }

    return dto2FormErrors;
  }
};

import { get } from 'lodash';

import type { Dto2FormConfigInterface } from '@fc/dto2form';
import type { FormConfigInterface } from '@fc/forms';

export const getConfigFormByIdHelper = (
  id: string,
  config: Dto2FormConfigInterface,
): FormConfigInterface => {
  const form = get(config, [id, 'form']);
  if (!form) {
    const msg = `Form config with id "${id}" not found.`;
    throw new Error(msg);
  }
  return form;
};

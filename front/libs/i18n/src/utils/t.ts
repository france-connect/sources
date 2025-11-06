import { Strings } from '@fc/common';

import { I18nService } from '../services';
import type { TranslationsReplacementType } from '../types';

/**
 * Shorthand to use the library in the codebase
 *
 * @see ../../README.md for more details
 */
export const t = (key: string, values?: TranslationsReplacementType) =>
  I18nService.instance().translate(key, {
    ...values,
    NBSP_UNICODE: Strings.NBSP_UNICODE,
  });

import type { TranslationsReplacement } from '../interfaces';
import { I18nService } from '../services';

/**
 * Shorthand to use the library in the codebase
 *
 * @see ../../README.md for more details
 */
export const t = (key: string, values?: TranslationsReplacement) =>
  I18nService.instance().translate(key, values);

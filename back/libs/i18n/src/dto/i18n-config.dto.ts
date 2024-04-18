/* istanbul ignore file */

// Declarative file
import { IsObject, IsString, Length } from 'class-validator';

import { I18nTranslationsMapType } from '../interfaces';

export class I18nConfig {
  @IsString()
  @Length(5, 5)
  readonly defaultLanguage: string;

  @IsObject()
  readonly translations: Record<string, I18nTranslationsMapType>;
}

import { I18nServiceNotInitializedExceptions, I18nTranslationNotFound } from '../exceptions';
import { TranslationMap, TranslationsReplacement, TranslationValue } from '../interfaces';

let INSTANCE: I18nService | null = null;

export class I18nService {
  private constructor(
    private readonly locale: string,
    private readonly translations: TranslationMap,
  ) {
    this.locale = locale;
    this.translations = translations;
  }

  static initialize(locale: string, map: TranslationMap): void {
    INSTANCE = new I18nService(locale, map);
  }

  static instance(): I18nService {
    if (INSTANCE === null) {
      throw new I18nServiceNotInitializedExceptions();
    }

    return INSTANCE;
  }

  translate(key: string, values: TranslationsReplacement = {}): string {
    let translated = this.translations[key];

    if (translated === undefined) {
      throw new I18nTranslationNotFound(key);
    }

    translated = this.handlePlural(translated, values);

    translated = this.handleSubstitution(translated, values);

    return translated;
  }

  // Makes it easier for testing purpose to have instance members
  // eslint-disable-next-line class-methods-use-this
  private handlePlural(input: TranslationValue, values: TranslationsReplacement): string {
    if (typeof input === 'string') {
      return input;
    }

    const count = values[input.term];
    const def = input.definition;

    if (count === 0) {
      return def.zero || def.other;
    }

    if (count === 1) {
      return def.one || def.few || def.other;
    }

    if (count === 2) {
      return def.two || def.few || def.other;
    }

    if (count >= 3 && count <= 6) {
      return def.few || def.other;
    }

    if (count > 6) {
      return def.many || def.other;
    }

    return def.other;
  }

  // Makes it easier for testing purpose to have instance members
  // eslint-disable-next-line class-methods-use-this
  private handleSubstitution(input: string, values: TranslationsReplacement): string {
    let replaced = input;

    Object.keys(values).forEach((key) => {
      const pattern = new RegExp(`{${key}}`, 'g');
      replaced = replaced.replace(pattern, String(values[key]));
    });

    return replaced;
  }
}
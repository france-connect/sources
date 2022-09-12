/* istanbul ignore file */

// Declarative code
export class I18nTranslationNotFound extends Error {
  constructor(key: string) {
    super();
    this.message = `Translation not found ${key}`;
  }
}

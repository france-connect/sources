/* istanbul ignore file */

// Declarative code
export class I18nServiceNotInitializedExceptions extends Error {
  public message = 'i18n is not initialized. Forgot to call I18nService.initialize()?';
}

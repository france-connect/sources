/* istanbul ignore file */

// Declarative file
import { I18nComplexTermInterface } from './i18n-complex-term.interface';

export type I18nTermKey = string;

export type I18nSimpleTerm = string;

export type I18nTermType = I18nSimpleTerm | I18nComplexTermInterface;

export type I18nTranslationsMapType = Record<I18nTermKey, I18nTermType>;

export type I18nVariables = Record<string, string | number>;

/* istanbul ignore file */

// Declarative code
import type { TranslationObjectInterface } from '../interfaces';

export type TranslationsReplacementType = Record<string, string | number>;

export type TranslationValueType = string | TranslationObjectInterface;

export type TranslationMapType = Record<string, TranslationValueType>;

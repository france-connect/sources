/* istanbul ignore file */

// Declarative code
export interface TranslationObject {
  term: string;
  /**
   * @todo See if we can enforce the use of at least one property
   */
  definition: {
    zero?: string;
    one?: string;
    two?: string;
    few?: string;
    many?: string;
    other: string;
  };
}

export type TranslationsReplacement = Record<string, string | number>;

export type TranslationValue = string | TranslationObject;

export type TranslationMap = Record<string, TranslationValue>;

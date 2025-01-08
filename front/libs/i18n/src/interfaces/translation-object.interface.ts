export interface TranslationObjectInterface {
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

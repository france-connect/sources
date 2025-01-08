/**
 * Exemple :
 * { toto: string } => { toto: string[] }
 */
export type valueToArray<T> = {
  [P in keyof T]: T[P][];
};

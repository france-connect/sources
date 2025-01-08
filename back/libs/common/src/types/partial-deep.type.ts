export type PartialDeep<T> = T extends object
  ? {
      [P in keyof T]?: PartialDeep<T[P]>;
    }
  : T;

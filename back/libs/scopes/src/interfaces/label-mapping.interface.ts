export type Values<T extends { [key: string]: string }> = T[keyof T];

export type ILabelMapping<T extends { [key: string]: string }> = Record<
  Values<T>,
  string
>;

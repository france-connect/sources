export type PropsWithHintType<
  T = string | React.ReactNode | ((required?: boolean) => React.ReactNode),
> = {
  hint?: T;
};

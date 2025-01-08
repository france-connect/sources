export type PropsWithHintType<
  T = string | React.ReactNode | ((required?: boolean | undefined) => React.ReactNode),
> = {
  hint?: T;
};

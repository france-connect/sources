// @NOTE Can be used to format the value before displaying it
// Use this to format text input like phone number or date
// EX: (value) => value.toUpperCase()
// EX: (value) => value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
export type FormatterType<
  InputValue = unknown,
  OutputValue = string | readonly string[] | boolean | number | undefined,
> = (value: InputValue) => OutputValue;

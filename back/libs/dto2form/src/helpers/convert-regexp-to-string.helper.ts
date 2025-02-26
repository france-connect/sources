export function convertRegExpToStrings(validationArgs: unknown[]): unknown[] {
  if (validationArgs && Array.isArray(validationArgs)) {
    validationArgs.forEach((arg, index) => {
      if (arg instanceof RegExp) {
        validationArgs[index] = arg.source;
      }
    });

    return validationArgs;
  }

  return [];
}

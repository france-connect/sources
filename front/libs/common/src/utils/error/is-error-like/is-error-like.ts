export const isErrorLike = (err: unknown): err is Error => {
  if (err instanceof Error) {
    return true;
  }

  const isObject = typeof err === 'object' && err !== null;
  const hasStack = isObject && 'stack' in err;
  const hasMessage = isObject && 'message' in err;
  if (isObject && hasMessage && hasStack) {
    return true;
  }

  return false;
};

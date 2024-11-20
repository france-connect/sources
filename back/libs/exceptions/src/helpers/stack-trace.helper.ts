export function getStackTraceArray(exception: any) {
  const { stack = '' } = exception;
  let stackTrace = stack.split('\n');

  if (exception.originalError) {
    const originalStack = exception.originalError.stack || '';
    stackTrace = stackTrace.concat(originalStack.split('\n'));
  }

  // Remove last empty element if any
  if (stackTrace[stackTrace.length - 1] === '') {
    stackTrace.pop();
  }

  return stackTrace;
}

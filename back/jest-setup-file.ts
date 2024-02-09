/**
 * @see https://github.com/nestjs/nest/issues/1305#issuecomment-440697498
 */
import 'reflect-metadata';

/**
 * In order to highlight and to deal with async unhandled rejections
 * and fails the corresponding tests
 */
process.on('unhandledRejection', (err: unknown) => {
  if (err instanceof Error) {
    process.stdout.write(
      `\x1b[1;31m${err.message}\x1b[0m\n\x1b[1;37m${err.stack}\n`,
    );
    fail();
  } else {
    fail(`\x1b[1;31m${JSON.stringify(err)}\x1b[0m`);
  }
});

/**
 * Hide odic-provider unsupported nodejs runtime version warning
 * since this is not a blocking issue
 * and justs causes a lot of noise in tests output
 */
const consoleWarnOriginal = console.warn;
const OIDC_PROVIDER_UNSUPPORTED_RUNTIME_WARNING = [
  'oidc-provider WARNING: Unsupported Node.js runtime version. Use ^12.19.0, ^14.15.0, or ^16.13.0',
  '\x1B[31;1moidc-provider WARNING: Unsupported Node.js runtime version. Use ^12.19.0, ^14.15.0, or ^16.13.0\x1B[0m',
];

console.warn = function warn(...args) {
  if (!OIDC_PROVIDER_UNSUPPORTED_RUNTIME_WARNING.includes(args[0])) {
    consoleWarnOriginal(...args);
  }
};

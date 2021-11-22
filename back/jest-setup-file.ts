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

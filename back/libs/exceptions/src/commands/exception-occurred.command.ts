import { ArgumentsHost } from '@nestjs/common';

import { BaseException } from '../exceptions';

export class ExceptionOccurredCommand {
  constructor(
    public readonly exception: BaseException,
    public readonly host: ArgumentsHost,
  ) {}
}

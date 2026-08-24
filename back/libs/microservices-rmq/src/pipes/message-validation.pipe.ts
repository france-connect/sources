import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

import { MicroservicesRmqMessageValidationException } from '../exceptions'; // Remplace par ton propre chemin

export class MicroservicesRmqMessageValidationPipe extends ValidationPipe {
  constructor(options: ValidationPipeOptions = {}) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => {
        throw new MicroservicesRmqMessageValidationException(errors);
      },
      ...options,
    });
  }
}

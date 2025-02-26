import { ValidationPipe } from '@nestjs/common';

import { MicroservicesRmqMessageValidationException } from '../exceptions'; // Remplace par ton propre chemin

export class MicroservicesRmqMessageValidationPipe extends ValidationPipe {
  constructor() {
    super({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => {
        throw new MicroservicesRmqMessageValidationException(errors);
      },
    });
  }
}

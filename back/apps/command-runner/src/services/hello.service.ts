import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';

@Injectable()
export class HelloService {
  constructor(private readonly logger: LoggerService) {}

  sayHello(name?: string): void {
    if (name) {
      this.logger.info(`Hello ${name}`);
    } else {
      this.logger.info(`Hello world!`);
    }
  }
}

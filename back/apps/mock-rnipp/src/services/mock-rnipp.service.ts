import { Injectable } from '@nestjs/common';

@Injectable()
export class MockRnippService {
  getHello(): string {
    return 'Hello World!';
  }
}

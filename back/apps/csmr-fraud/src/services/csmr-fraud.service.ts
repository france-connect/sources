import { Injectable } from '@nestjs/common';

@Injectable()
export class CsmrFraudService {
  getHello(): string {
    return 'Hello World!';
  }
}

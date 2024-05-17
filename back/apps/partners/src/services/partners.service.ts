import { Injectable } from '@nestjs/common';

@Injectable()
export class PartnersService {
  getHello(): string {
    return 'Hello Partners FC!';
  }
}

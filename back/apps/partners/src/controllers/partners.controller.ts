import { Controller, Get } from '@nestjs/common';

import { PartnersService } from '../services/partners.service';

@Controller()
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get('/hello')
  getHello(): string {
    return this.partnersService.getHello();
  }
}

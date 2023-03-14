import { Controller, Get } from '@nestjs/common';

import { MockRnippService } from '../services';

@Controller()
export class MockRnippController {
  constructor(private readonly mockRnippService: MockRnippService) {}

  @Get()
  getHello(): string {
    return this.mockRnippService.getHello();
  }
}

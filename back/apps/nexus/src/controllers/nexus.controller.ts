import { Controller, Get } from '@nestjs/common';

import { NexusBackRoutes } from '../enums';

@Controller()
export class NexusController {
  @Get(NexusBackRoutes.INDEX)
  getIndex(): { status: string } {
    return { status: 'OK' };
  }
}

import {
  Body,
  Controller,
  Injectable,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Webhooks, WebhooksGuard } from '@fc/webhooks';

import { InvitationInputDto } from '../dto';
import { PartnersBackRoutes, PartnersHookNames } from '../enums';
import { PartnersInvitationService } from '../services';

@Injectable()
@Controller()
export class InvitationController {
  constructor(private readonly partnersInvitation: PartnersInvitationService) {}

  @Post(PartnersBackRoutes.INVITATION)
  @UsePipes(ValidationPipe)
  @Webhooks(PartnersHookNames.INVITATION)
  @UseGuards(WebhooksGuard)
  async invite(@Body() body: InvitationInputDto): Promise<void> {
    const { emails, instances } = body;
    await this.partnersInvitation.inviteMany(emails, instances);
  }
}

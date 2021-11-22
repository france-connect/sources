import { Module } from '@nestjs/common';

import { MailerService } from './mailer.service';
import { TemplateService } from './template.service';

@Module({
  providers: [MailerService, TemplateService],
  exports: [MailerService],
})
export class MailerModule {}

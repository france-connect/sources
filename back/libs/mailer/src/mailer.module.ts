/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';

import { ConfigModule, ConfigService } from '@fc/config';

import { MailerConfig } from './dto';
import { MailerService, SmtpService, TemplateService } from './services';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const {
          from: { name, email },
          options,
        } = configService.get<MailerConfig>('Mailer');
        const { host, port, secure } = options;
        const params = {
          transport: {
            host,
            port,
            secure,
          },
          defaults: {
            from: `"${name}" <${email}>`,
          },
        };

        return params;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService, TemplateService, SmtpService],
  exports: [MailerService, SmtpService, TemplateService],
})
export class MailerModule {}

import { Module } from '@nestjs/common';
import {
  MailerModule as NestMailerModule,
  MailerOptions,
} from '@nestjs-modules/mailer';

import { ConfigModule, ConfigService } from '@fc/config';

import { MailerConfig } from './dto';
import { MailerService, SmtpService, TemplateService } from './services';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const { from, options } = configService.get<MailerConfig>('Mailer');
        const { host, port, secure, rejectUnauthorized = true } = options;
        const params: MailerOptions = {
          transport: {
            host,
            port,
            secure,
            tls: { rejectUnauthorized },
          },
        };

        if (from) {
          const { name, email } = from;
          params.defaults = {
            from: `"${name}" <${email}>`,
          };
        }
        return params;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService, TemplateService, SmtpService],
  exports: [MailerService, SmtpService, TemplateService],
})
export class MailerModule {}

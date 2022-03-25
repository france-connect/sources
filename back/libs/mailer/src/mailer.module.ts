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
      useFactory: async (configService: ConfigService) => {
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
            auth: {
              user: '51e1a10235aba6ac1d72ce3ddd484cab',
              pass: '035cb7dd8970a62457d4e6e82208e0b5',
            },
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

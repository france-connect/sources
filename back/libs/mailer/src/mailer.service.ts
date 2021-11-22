import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { MailerConfig } from './dto';
import { TemplateNotFoundException } from './exceptions';
import { MailOptions, Transport } from './interfaces';
import { TemplateService } from './template.service';
import { MailjetTransport, StdoutTransport } from './transports';

@Injectable()
export class MailerService {
  private transport: Transport;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly template: TemplateService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  onModuleInit() {
    const { transport } = this.config.get<MailerConfig>('Mailer');

    switch (transport) {
      case 'mailjet':
        this.transport = new MailjetTransport(this.config);
        break;
      case 'logs':
        this.transport = new StdoutTransport(this.logger);
        break;
      default:
        throw new Error(`Invalid mailer "${transport}"`);
    }
  }

  async send(params: MailOptions): Promise<unknown> {
    try {
      return this.transport.send(params);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async mailToSend(fileName, values): Promise<string> {
    const { templatePaths } = this.config.get<MailerConfig>('Mailer');
    const path = this.template.getFilePath(fileName, templatePaths);
    if (!path) {
      throw new TemplateNotFoundException();
    }
    const template = await this.template.readFile(path);
    const html = this.template.render(template, values);
    return html;
  }
}

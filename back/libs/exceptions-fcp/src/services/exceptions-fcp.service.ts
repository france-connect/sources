import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { I18nService } from '@fc/i18n';
import { TemplateMethod } from '@fc/view-templates';

import { ExceptionsFcpConfig } from '../dto';
import {
  ExceptionFcpActionInput,
  ExceptionFcpActionOutput,
  ExceptionFcpSupportInput,
  ExceptionFcpSupportOutput,
} from '../interfaces';

@Injectable()
export class ExceptionsFcpService {
  constructor(
    private readonly config: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  @TemplateMethod('showSupportButton')
  showSupportButton(code: string): boolean {
    const config = this.config.get<ExceptionsFcpConfig>('ExceptionsFcp');
    const hasCustomAction = config.items.some(
      (item) => item.errorCode === code,
    );
    return hasCustomAction;
  }

  @TemplateMethod('getCustomErrorAction')
  getCustomErrorAction({
    code,
    message,
  }: ExceptionFcpActionInput): ExceptionFcpActionOutput {
    const config = this.config.get<ExceptionsFcpConfig>('ExceptionsFcp');
    const customAction = config.items.find((item) => item.errorCode === code);

    const hasCustomError = customAction && customAction.active;
    if (!hasCustomError) {
      return {
        message,
        title: this.i18n.translate('error.support.title'),
      };
    }

    return {
      message: this.i18n.translate(customAction.errorMessage),
      title: this.i18n.translate(customAction.actionTitle),
    };
  }

  @TemplateMethod('getCustomErrorSupport')
  getCustomErrorSupport({
    code,
    href,
  }: ExceptionFcpSupportInput): ExceptionFcpSupportOutput {
    const config = this.config.get<ExceptionsFcpConfig>('ExceptionsFcp');
    const customAction = config.items.find((item) => item.errorCode === code);

    const hasCustomError = customAction && customAction.active;
    if (!hasCustomError) {
      return {
        href,
        buttonLabel: this.i18n.translate('error.support.button_label'),
      };
    }

    return {
      href: customAction.actionHref,
      buttonLabel: this.i18n.translate(customAction.actionButtonLabel),
    };
  }
}

import { Response } from 'express';

import { CommandHandler } from '@nestjs/cqrs';

import { ApiContentType } from '@fc/app';

import { ExceptionOccurredCommand } from '../commands';
import { FcWebHtmlExceptionFilter, FcWebJsonExceptionFilter } from '../filters';

@CommandHandler(ExceptionOccurredCommand)
export class ExceptionOccurredHandler {
  constructor(
    protected readonly htmlFilter: FcWebHtmlExceptionFilter,
    protected readonly jsonFilter: FcWebJsonExceptionFilter,
  ) {}

  execute(command: ExceptionOccurredCommand) {
    const contentType = this.getContentType(
      command.host.switchToHttp().getResponse(),
    );

    if (contentType === ApiContentType.JSON) {
      return this.jsonFilter.catch(command.exception, command.host);
    } else {
      return this.htmlFilter.catch(command.exception, command.host);
    }
  }

  protected getContentType(res: Response): string {
    const contentTypeHeader = res.getHeaders()['content-type'] as
      | string
      | undefined;

    if (contentTypeHeader) {
      const parsedContentType = contentTypeHeader.split(';')[0];
      if (parsedContentType) {
        return parsedContentType;
      }
    }

    return ApiContentType.HTML;
  }
}

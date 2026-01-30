import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { TemplateMethod } from '@fc/view-templates';

import { AppConfig } from '../dto';

@Injectable()
export class AssetsService {
  constructor(private readonly config: ConfigService) {}

  @TemplateMethod('asset')
  getAssetFullPath(assetPath: string): string {
    const { assetsUrlDomain, assetsUrlPrefix } =
      this.config.get<AppConfig>('App');

    const prefix = assetsUrlDomain
      ? `https://${assetsUrlDomain}${assetsUrlPrefix}`
      : assetsUrlPrefix;

    return `${prefix}${assetPath}`;
  }
}

import { Request } from 'express';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { DeviceConfig } from '../dto';

@Injectable()
export class DeviceHeaderFlagsService {
  constructor(private readonly config: ConfigService) {}

  isSuspicious(req: Request): boolean {
    return this.get(req, 'x-suspicious');
  }

  private get(req: Request, flagName: string): boolean {
    const { headerFlags } = this.config.get<DeviceConfig>('Device');

    const flag = headerFlags.find(({ name }) => name === flagName);

    return req.headers[flagName] === flag.positiveValue;
  }
}

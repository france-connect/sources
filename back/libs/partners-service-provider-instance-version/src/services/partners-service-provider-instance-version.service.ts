import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersServiceProviderInstanceVersion } from '@entities/typeorm';

import { uuid } from '@fc/common';

import { ServiceProviderInstanceVersionDto } from '../dto';

@Injectable()
export class PartnersServiceProviderInstanceVersionService {
  constructor(
    @InjectRepository(PartnersServiceProviderInstanceVersion)
    private readonly repository: Repository<PartnersServiceProviderInstanceVersion>,
  ) {}

  async create(
    version: ServiceProviderInstanceVersionDto,
    instanceId: uuid,
  ): Promise<PartnersServiceProviderInstanceVersion> {
    const data = {
      data: { ...version },
      instance: instanceId,
    } as unknown as PartnersServiceProviderInstanceVersion;
    const result = await this.repository.save(data);

    return result;
  }
}

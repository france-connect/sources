import { ValidatorOptions } from 'class-validator';
import { lastValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { Inject, Injectable, ValidationError } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { IPaginationOptions, IPaginationResult, validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { TracksProtocol } from '@fc/microservices';
import { IOidcIdentity } from '@fc/oidc';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { TrackDto } from '../dto';
import { TracksResponseException } from '../exceptions';
import { TracksResults } from '../interfaces';

export const DTO_OPTIONS: ValidatorOptions = {
  whitelist: true,
  forbidUnknownValues: true,
  forbidNonWhitelisted: true,
};

@Injectable()
export class TracksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    @Inject('TracksBroker') private readonly broker: ClientProxy,
  ) {}

  async getList(
    identity: Partial<IOidcIdentity>,
    options: IPaginationOptions,
  ): Promise<{ meta: IPaginationResult; payload: TrackDto[] }> {
    const { requestTimeout } = this.config.get<RabbitmqConfig>('TracksBroker');

    try {
      const order = this.broker
        .send<TracksResults>(TracksProtocol.Commands.GET, { identity, options })
        .pipe(timeout(requestTimeout));

      const { meta, payload } = await lastValueFrom(order);

      const errors = await this.checkTracks(payload);

      if (errors) {
        this.logger.err({ errors });
        throw new Error('Invalid Tracks format');
      }

      return {
        payload,
        meta,
      };
    } catch (error) {
      throw new TracksResponseException(error);
    }
  }

  /**
   * @todo refacto : rendre générique et disponible pour les autres librairies
   */
  private async checkTracks(
    datas: object[],
  ): Promise<ValidationError[] | null> {
    const jobs = datas.map(
      async (data) => await validateDto(data, TrackDto, DTO_OPTIONS),
    );

    const errorsGroup = await Promise.all(jobs);

    const errors = errorsGroup.flat();

    return errors.length ? errors : null;
  }
}

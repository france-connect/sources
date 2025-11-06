import { plainToInstance } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';

import { Injectable, PipeTransform } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { DatapassWebhookPayloadDto } from '@fc/datapass';
import { LoggerService } from '@fc/logger';

import {
  DatapassTransformationException,
  DatapassValidationException,
} from '../exceptions';
import { SimplifiedDatapassPayload } from '../interfaces';

export const validationOptions: ValidatorOptions = {
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  skipMissingProperties: false,
  whitelist: true,
};

@Injectable()
export class DatapassTransformationPipe
  implements PipeTransform<unknown, Promise<SimplifiedDatapassPayload>>
{
  constructor(private readonly logger: LoggerService) {}

  async transform(rawPayload: unknown): Promise<SimplifiedDatapassPayload> {
    this.logger.debug(
      'Starting Datapass webhook validation and transformation',
    );

    const dto = await this.validatePayloadStructure(rawPayload);
    const simplifiedPayload = this.transformToSimplifiedPayload(dto);

    this.logger.debug({
      message: 'Datapass payload validation successful',
      datapassRequestId: simplifiedPayload.datapassRequestId,
    });

    return simplifiedPayload;
  }

  private async validatePayloadStructure(
    rawPayload: unknown,
  ): Promise<DatapassWebhookPayloadDto> {
    const dto = plainToInstance(DatapassWebhookPayloadDto, rawPayload, {
      enableImplicitConversion: true,
    });

    const validationErrors = await validateDto(
      dto,
      DatapassWebhookPayloadDto,
      validationOptions,
    );

    if (validationErrors.length > 0) {
      this.logger.debug({
        message: 'Datapass payload validation failed',
        validationErrors,
      });

      throw new DatapassValidationException();
    }

    return dto;
  }

  private transformToSimplifiedPayload(
    payload: DatapassWebhookPayloadDto,
  ): SimplifiedDatapassPayload {
    try {
      /**
       * @TODO
       * Replace structure when we will know real data returned by Datapass
       * For now, we use dummy data from official documentation:
       * @see https://github.com/etalab/data_pass/blob/develop/docs/webhooks.md
       */
      return {
        event: payload.event,
        datapassRequestId: payload.data.id.toString(),
        state: payload.data.state,
        organizationName: payload.data.organization.name,
        applicant: {
          email: payload.data.applicant.email,
          firstname: payload.data.applicant.given_name,
          lastname: payload.data.applicant.family_name,
        },
        datapassName: payload.data.data.intitule,
        scopes: payload.data.data.scopes,
        technicalContact: {
          email: payload.data.data.contact_technique_email,
          firstname: payload.data.data.contact_technique_given_name,
          lastname: payload.data.data.contact_technique_family_name,
        },
      };
    } catch {
      throw new DatapassTransformationException();
    }
  }
}

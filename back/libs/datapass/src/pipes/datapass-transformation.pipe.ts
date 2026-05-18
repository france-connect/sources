import { plainToInstance } from 'class-transformer';
import { ValidationError, ValidatorOptions } from 'class-validator';

import { Injectable, PipeTransform } from '@nestjs/common';

import {
  getAllPropertiesErrors,
  normalizeEmail,
  validateDto,
} from '@fc/common';
import { LoggerService } from '@fc/logger';

import { DatapassWebhookPayloadDto } from '../dto';
import {
  DatapassAuthorizationRequestClass,
  DatapassAuthorizationState,
} from '../enums';
import {
  DatapassEidasLevelException,
  DatapassNoActiveAuthorizationException,
  DatapassTransformationException,
  DatapassValidationException,
} from '../exceptions';
import { Authorization, SimplifiedDatapassPayload } from '../interfaces';

export const validationOptions: ValidatorOptions = {
  forbidNonWhitelisted: false,
  forbidUnknownValues: false,
  skipMissingProperties: false,
  whitelist: true,
};

@Injectable()
export class DatapassTransformationPipe implements PipeTransform<
  unknown,
  Promise<SimplifiedDatapassPayload | null>
> {
  constructor(private readonly logger: LoggerService) {}

  async transform(
    rawPayload: unknown,
  ): Promise<SimplifiedDatapassPayload | null> {
    if (this.isTestPayload(rawPayload as Record<string, unknown>)) {
      return null;
    }

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

  private isTestPayload(rawPayload: Record<string, unknown>): boolean {
    return rawPayload?.test === true;
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
      this.checkEidasLevel(validationErrors);

      throw new DatapassValidationException(validationErrors);
    }

    return dto;
  }

  private checkEidasLevel(validationErrors: ValidationError[]): void {
    const simplifiedErrors = getAllPropertiesErrors(validationErrors);

    if (simplifiedErrors.includes('data.data.france_connect_eidas: isIn')) {
      throw new DatapassEidasLevelException();
    }
  }

  private transformToSimplifiedPayload(
    payload: DatapassWebhookPayloadDto,
  ): SimplifiedDatapassPayload {
    try {
      const currentAuthorization = this.getCurrentAuthorization(payload);

      return {
        event: payload.event,
        datapassRequestId: payload.data.id.toString(),
        datapassAuthorizationId: currentAuthorization.id,
        datapassEidasLevel: payload.data.data.france_connect_eidas,
        state: payload.data.state,
        organization: payload.data.organization,
        applicant: {
          email: normalizeEmail(payload.data.applicant.email),
          firstname: payload.data.applicant.given_name,
          lastname: payload.data.applicant.family_name,
          phone: payload.data.applicant.phone_number,
        },
        datapassName: payload.data.data.intitule,
        scopes: payload.data.data.scopes,
        technicalContact: {
          email: normalizeEmail(payload.data.data.contact_technique_email),
          firstname: payload.data.data.contact_technique_given_name,
          lastname: payload.data.data.contact_technique_family_name,
          phone: payload.data.data.contact_technique_phone_number,
        },
      };
    } catch (error) {
      throw new DatapassTransformationException(error);
    }
  }

  private getCurrentAuthorization(
    payload: DatapassWebhookPayloadDto,
  ): Authorization {
    const currentAuthorization = payload.data.authorizations.find(
      (authorization) =>
        authorization.state === DatapassAuthorizationState.ACTIVE &&
        authorization.authorization_request_class ===
          DatapassAuthorizationRequestClass.FRANCE_CONNECT &&
        authorization.revoked === false,
    );

    if (!currentAuthorization) {
      throw new DatapassNoActiveAuthorizationException();
    }

    return currentAuthorization;
  }
}

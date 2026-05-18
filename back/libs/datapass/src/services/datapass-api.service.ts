import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { getAllPropertiesErrors, nowInSeconds } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import {
  DATAPASS_LEGACY_SCOPES,
  DATAPASS_MAX_PAGINATION_ITERATIONS,
  DATAPASS_PAGE_SIZE,
} from '../constants';
import { DatapassApiResponseDto, DatapassConfig } from '../dto';
import {
  DatapassApiRoutes,
  DatapassAuthorizationState,
  DatapassEidasLevels,
  DatapassEvents,
} from '../enums';
import {
  DatapassApiHttpException,
  DatapassApiResponseValidationException,
  DatapassPaginationLimitExceededException,
} from '../exceptions';
import {
  DatapassApiResponseInterface,
  DatapassFilterableItemInterface,
  DatapassPayloadInterface,
} from '../interfaces';

const DEFAULT_ORGANISATION_NAME = 'Organisation inconnue';

const VALIDATION_OPTIONS = {
  whitelist: true,
  forbidNonWhitelisted: false,
  skipMissingProperties: false,
};

@Injectable()
export class DatapassApiService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    private readonly logger: LoggerService,
  ) {}

  async getHabilitations(
    eidasLevels: DatapassEidasLevels[],
    since?: Date,
  ): Promise<DatapassPayloadInterface[]> {
    const accessToken = await this.getAccessToken();
    const rawData = await this.fetchAllDemandes(accessToken);

    const filtered = rawData.filter((item) =>
      this.matchesFilters(item, eidasLevels, since),
    );

    return this.validateItems(filtered);
  }

  private async fetchAllDemandes(accessToken: string): Promise<unknown[]> {
    const { apiUrl } = this.config.get<DatapassConfig>('Datapass');
    const url = `${apiUrl}${DatapassApiRoutes.DEMANDES}`;

    const all: unknown[] = [];
    let offset = 0;
    let hasMore = true;
    let iterations = 0;

    while (hasMore) {
      this.assertPaginationWithinLimit(iterations);

      const page = await this.fetchValidatedSpRequests(
        url,
        accessToken,
        offset,
      );

      all.push(...page);

      if (page.length < DATAPASS_PAGE_SIZE) {
        hasMore = false;
      } else {
        offset += DATAPASS_PAGE_SIZE;
        iterations++;
      }
    }

    return all;
  }

  private async fetchValidatedSpRequests(
    url: string,
    accessToken: string,
    offset: number,
  ): Promise<unknown[]> {
    try {
      const { data } = await lastValueFrom(
        this.httpService.get<unknown[]>(url, {
          params: {
            state: 'validated',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            definition_id: 'france_connect',
            limit: DATAPASS_PAGE_SIZE,
            offset,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (error) {
      throw new DatapassApiHttpException(error as Error);
    }
  }

  private assertPaginationWithinLimit(iterations: number): void {
    if (iterations >= DATAPASS_MAX_PAGINATION_ITERATIONS) {
      throw new DatapassPaginationLimitExceededException();
    }
  }

  async getHabilitationById(id: number): Promise<DatapassPayloadInterface> {
    const accessToken = await this.getAccessToken();
    const { apiUrl } = this.config.get<DatapassConfig>('Datapass');

    let rawData: unknown;

    try {
      ({ data: rawData } = await lastValueFrom(
        this.httpService.get<unknown>(
          `${apiUrl}${DatapassApiRoutes.DEMANDE.replace(':id', String(id))}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        ),
      ));
    } catch (error) {
      this.logger.warning({
        message: 'Datapass API HTTP request failed',
        datapassRequestId: id,
      });
      throw new DatapassApiHttpException(error as Error);
    }

    const habilitation = await this.validateItem(rawData);

    if (habilitation === null) {
      throw new DatapassApiResponseValidationException();
    }

    return this.toPayload(habilitation);
  }

  private async getAccessToken(): Promise<string> {
    const { apiUrl, clientId, clientSecret } =
      this.config.get<DatapassConfig>('Datapass');

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    let data: { access_token: string };

    try {
      ({ data } = await lastValueFrom(
        this.httpService.post<{ access_token: string }>(
          `${apiUrl}${DatapassApiRoutes.TOKEN}`,
          params.toString(),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        ),
      ));
    } catch (error) {
      this.logger.warning({
        message: 'Datapass OAuth2 token request failed',
        error,
      });
      throw new DatapassApiHttpException(error as Error);
    }

    return data.access_token;
  }

  private async validateItems(
    rawData: unknown[],
  ): Promise<DatapassPayloadInterface[]> {
    const payloads: DatapassPayloadInterface[] = [];

    for (const item of rawData) {
      const validated = await this.validateItem(item);

      if (validated === null) {
        continue;
      }

      try {
        payloads.push(this.toPayload(validated));
      } catch (error) {
        const id = this.extractItemId(item);
        this.logger.warning({
          message: 'Datapass API payload mapping failed, skipping entry',
          datapassRequestId: id,
          error: (error as Error).message,
        });
      }
    }

    return payloads;
  }

  private toPayload(
    apiResponse: DatapassApiResponseInterface,
  ): DatapassPayloadInterface {
    const organisationName =
      apiResponse.organisation.insee_payload.etablissement.uniteLegale
        .denominationUniteLegale ?? DEFAULT_ORGANISATION_NAME;

    const rawScopes: string[] = JSON.parse(apiResponse.data.scopes);
    const scopes = rawScopes.filter((s) => !DATAPASS_LEGACY_SCOPES.includes(s));

    return {
      event: DatapassEvents.APPROVE,
      fired_at: nowInSeconds(),
      model_type: 'AuthorizationRequest',
      last_validated_at: apiResponse.last_validated_at,
      data: {
        id: apiResponse.id,
        public_id: apiResponse.public_id,
        state: apiResponse.state,
        form_uid: apiResponse.form_uid,
        organization: {
          id: apiResponse.organisation.id,
          name: organisationName,
          siret: apiResponse.organisation.siret,
        },
        applicant: {
          email: apiResponse.applicant.email,
          given_name: apiResponse.applicant.given_name,
          family_name: apiResponse.applicant.family_name,
        },
        data: {
          intitule: apiResponse.data.intitule,
          france_connect_eidas: apiResponse.data.france_connect_eidas,
          scopes,
          contact_technique_given_name:
            apiResponse.data.contact_technique_given_name,
          contact_technique_family_name:
            apiResponse.data.contact_technique_family_name,
          contact_technique_phone_number:
            apiResponse.data.contact_technique_phone_number,
          contact_technique_email: apiResponse.data.contact_technique_email,
        },
        authorizations: apiResponse.habilitations
          .filter(
            (habilitation) =>
              habilitation.state === DatapassAuthorizationState.ACTIVE &&
              !habilitation.revoked,
          )
          .map((habilitation) => ({
            id: String(habilitation.id),
            state: habilitation.state,
            authorization_request_class:
              habilitation.authorization_request_class,
            revoked: habilitation.revoked,
          })),
      },
    };
  }

  private async validateItem(
    item: unknown,
  ): Promise<DatapassApiResponseInterface | null> {
    const apiResponseDto = plainToInstance(DatapassApiResponseDto, item, {
      enableImplicitConversion: true,
    });

    try {
      await validateOrReject(apiResponseDto, VALIDATION_OPTIONS);
    } catch (validationErrors) {
      const id = this.extractItemId(item);
      const message = getAllPropertiesErrors(
        validationErrors as ValidationError[],
      ).join(', ');

      this.logger.warning({
        message: 'Datapass API response validation failed, skipping entry',
        datapassRequestId: id,
        validationErrors: message,
      });
      return null;
    }

    return apiResponseDto as DatapassApiResponseInterface;
  }

  private matchesFilters(
    item: unknown,
    eidasLevels: DatapassEidasLevels[],
    since?: Date,
  ): boolean {
    return (
      this.isEidasLevelAllowed(
        item as Partial<DatapassFilterableItemInterface>,
        eidasLevels,
      ) &&
      this.isValidatedAfterDate(
        item as Partial<DatapassFilterableItemInterface>,
        since,
      )
    );
  }

  private isEidasLevelAllowed(
    item: Partial<DatapassFilterableItemInterface>,
    eidasLevels: DatapassEidasLevels[],
  ): boolean {
    return (eidasLevels as string[]).includes(
      item.data?.france_connect_eidas ?? '',
    );
  }

  private isValidatedAfterDate(
    item: Partial<DatapassFilterableItemInterface>,
    since?: Date,
  ): boolean {
    if (since === undefined) {
      return true;
    }

    if (!item.last_validated_at) {
      return false;
    }

    return new Date(item.last_validated_at) >= since;
  }

  private extractItemId(item: unknown): number | undefined {
    return (item as { id?: number })?.id;
  }
}

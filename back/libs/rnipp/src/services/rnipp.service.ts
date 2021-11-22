import { AxiosError, AxiosResponse } from 'axios';
import { ValidationError } from 'class-validator';
import { stringify } from 'querystring';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { getDtoErrors, RequiredExcept, validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { CitizenStatus, RnippConfig } from '../dto';
import { Genders, RnippResponseCodes } from '../enums';
import {
  RnippCitizenStatusFormatException,
  RnippDeceasedException,
  RnippFoundOnlyWithMaritalNameException,
  RnippHttpStatusException,
  RnippNotFoundMultipleEchoException,
  RnippNotFoundNoEchoException,
  RnippNotFoundSingleEchoException,
  RnippRejectedBadRequestException,
  RnippTimeoutException,
} from '../exceptions';
import { IPivotIdentity } from '../interfaces';
import { RnippResponseParserService } from './rnipp-response-parser.service';

@Injectable()
export class RnippService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly rnippResponseParserService: RnippResponseParserService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async check(identity: object) {
    this.logger.debug('Construct RNIPP request url');
    const requestUrl = this.buildRequestUrl(identity as IPivotIdentity);

    this.logger.debug('Dialing RNIPP endpoint');
    const rnippResponse = await this.callRnipp(requestUrl);

    this.logger.debug('Parsing RNIPP response');
    const citizenStatus = await this.rnippResponseParserService.parseRnippData(
      rnippResponse.data,
    );

    this.logger.debug('Validate RNIPP response');
    const errors = await validateDto(
      citizenStatus,
      CitizenStatus,
      validationOptions,
    );

    this.logger.debug('Check citizen status for error');
    this.checkCitizenStatusError(errors);

    const { identity: rnippIdentity, deceased, rnippCode } = citizenStatus;

    this.logger.debug('Check RNIPP rectification error');
    this.checkRnippRectificationError(rnippCode, deceased);

    this.logger.debug('Return RNIPP identity');

    this.logger.trace({ rnipp: { citizenStatus, errors } });
    return rnippIdentity;
  }

  private buildRequestUrl(
    identity: RequiredExcept<
      IPivotIdentity,
      'sub' | 'email' | 'phone_number' | 'preferred_username'
    >,
  ): string {
    const { protocol, hostname, baseUrl } =
      this.configService.get<RnippConfig>('Rnipp');

    const params = {
      rechercheType: 'S',
      nom: identity.family_name,
      prenoms: identity.given_name,
      dateNaissance: this.formatDateNaissance(identity.birthdate),
      sexe: this.formatSexe(identity.gender),
      codeLieuNaissance: this.formatCodeLieuNaissance(
        identity.birthplace,
        identity.birthcountry,
      ),
    };

    const url = `${protocol}://${hostname}${baseUrl}?${stringify(params)}`;

    this.logger.trace({ params, url });

    return url;
  }

  private formatSexe(gender: string): string {
    switch (gender) {
      case Genders.MALE:
        return Genders.ABBR_MALE;
      case Genders.FEMALE:
        return Genders.ABBR_FEMALE;
      case Genders.UNSPECIFIED:
        return Genders.ABBR_UNSPECIFIED;
      default:
        return '';
    }
  }

  private formatDateNaissance(birthdate: string) {
    return birthdate.replace(/-/g, '');
  }

  private formatCodeLieuNaissance(
    birthplace: string,
    birthcountry: string,
  ): string {
    return birthplace || birthcountry;
  }

  private async callRnipp(requestUrl: string): Promise<AxiosResponse<string>> {
    let response;
    const { timeout } = this.configService.get<RnippConfig>('Rnipp');

    try {
      response = await lastValueFrom(
        this.httpService.get(requestUrl, { timeout }),
      );
    } catch (error) {
      this.checkRnippHttpError(error);
    }
    return response;
  }

  // eslint-disable-next-line complexity
  private checkRnippRectificationError(
    rnippCode: string,
    deceasedStatus: boolean,
  ): void {
    switch (rnippCode) {
      case RnippResponseCodes.NOT_FOUND_SINGLE_ECHO:
        throw new RnippNotFoundSingleEchoException();
      case RnippResponseCodes.NOT_FOUND_MULTIPLE_ECHO:
        throw new RnippNotFoundMultipleEchoException();
      case RnippResponseCodes.FOUND_ONLY_WITH_MARITAL_NAME:
        throw new RnippFoundOnlyWithMaritalNameException();
      case RnippResponseCodes.NOT_FOUND_NO_ECHO:
        throw new RnippNotFoundNoEchoException();
      case RnippResponseCodes.REJECTED_BAD_REQUEST:
        throw new RnippRejectedBadRequestException();
    }

    if (deceasedStatus) {
      throw new RnippDeceasedException();
    }
  }

  private checkRnippHttpError(error: AxiosError) {
    switch (error.code) {
      /**
       * At the moment Axios does not use "ETIMEOUT" like native
       * but "ECONNABORTED" @see https://github.com/axios/axios/pull/2874
       */
      case 'ETIMEDOUT':
      case 'ECONNABORTED':
      case 'ECONNRESET':
        throw new RnippTimeoutException();
    }

    throw new RnippHttpStatusException();
  }

  private checkCitizenStatusError(errors: ValidationError[]) {
    const formattedDtoError = getDtoErrors(errors);

    if (formattedDtoError) {
      throw new RnippCitizenStatusFormatException();
    }
  }
}

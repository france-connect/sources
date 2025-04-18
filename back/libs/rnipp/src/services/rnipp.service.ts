import { AxiosError, AxiosResponse } from 'axios';
import { ValidationError } from 'class-validator';
import { stringify } from 'querystring';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { validateCog } from '@fc/cog';
import { getDtoErrors, RequiredExcept, validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';

import { CitizenStatus, RnippConfig } from '../dto';
import { RnippResponseCodes } from '../enums';
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
import { getRnippGenderFromGender } from '../mappers';
import { RnippResponseParserService } from './rnipp-response-parser.service';

@Injectable()
export class RnippService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly rnippResponseParserService: RnippResponseParserService,
  ) {}

  async check(identity: object) {
    const requestUrl = this.buildRequestUrl(identity as IPivotIdentity);

    const rnippResponse = await this.callRnipp(requestUrl);

    const citizenStatus = await this.rnippResponseParserService.parseRnippData(
      rnippResponse.data,
    );

    const errors = await validateDto(
      citizenStatus,
      CitizenStatus,
      validationOptions,
    );

    this.checkCitizenStatusError(errors);

    const { identity: rnippIdentity, deceased, rnippCode } = citizenStatus;

    this.checkRnippRectificationError(rnippCode, deceased);

    return rnippIdentity;
  }

  private buildRequestUrl(
    identity: RequiredExcept<
      IPivotIdentity,
      'sub' | 'email' | 'preferred_username' | 'rep_scope'
    >,
  ): string {
    const { protocol, hostname, baseUrl } =
      this.configService.get<RnippConfig>('Rnipp');

    const params = {
      rechercheType: 'S',
      nom: identity.family_name,
      prenoms: identity.given_name,
      dateNaissance: this.formatDateNaissance(identity.birthdate),
      sexe: getRnippGenderFromGender(identity.gender),
      codeLieuNaissance: this.formatCodeLieuNaissance(
        identity.birthplace,
        identity.birthcountry,
      ),
    };

    const url = `${protocol}://${hostname}${baseUrl}?${stringify(params)}`;

    return url;
  }

  private formatDateNaissance(birthdate: string) {
    return birthdate.replace(/-/g, '');
  }

  private formatCodeLieuNaissance(
    birthplace: string,
    birthcountry: string,
  ): string {
    /**
     * This control is used in legacy and seems necessary for RNIPP
     * We might encounter some weird birthplace codes,
     * but we can (must) not alter the idp provided identity.
     */
    const isCog = validateCog(birthplace);

    if (isCog) {
      return birthplace;
    }

    return birthcountry;
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

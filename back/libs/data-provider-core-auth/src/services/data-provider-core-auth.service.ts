import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { OidcIdentityDto } from '@fc/oidc';

import { CheckTokenResponseDto, DataProviderCoreAuthConfig } from '../dto';
import {
  CheckTokenFailedException,
  InvalidIdentityException,
  ReceivedInvalidScopeException,
} from '../exceptions';

const VALIDATION_OPTIONS = {
  whitelist: true,
};

@Injectable()
export class DataProviderCoreAuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly http: HttpService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getIdentity(token: string): Promise<OidcIdentityDto> {
    const response = await this.checkToken(token);

    const errors = await validateDto(
      response,
      CheckTokenResponseDto,
      VALIDATION_OPTIONS,
    );
    if (errors.length > 0) {
      this.logger.trace(errors);
      throw new InvalidIdentityException();
    }

    const { scope: validScope } = this.config.get<DataProviderCoreAuthConfig>(
      'DataProviderCoreAuth',
    );

    const { scope: receivedScopes, identity } = response;
    if (!receivedScopes.includes(validScope)) {
      throw new ReceivedInvalidScopeException(receivedScopes.join(' '));
    }

    return identity;
  }

  private async checkToken(token: string): Promise<CheckTokenResponseDto> {
    const { tokenEndpoint } = this.config.get<DataProviderCoreAuthConfig>(
      'DataProviderCoreAuth',
    );
    const body = { token };

    let response;

    try {
      const responseObservable = this.http.post<CheckTokenResponseDto>(
        tokenEndpoint,
        body,
      );
      response = await lastValueFrom(responseObservable);
    } catch (error) {
      throw new CheckTokenFailedException(error);
    }

    if (response.status !== 200) {
      throw new CheckTokenFailedException(`received code ${response.status}`);
    }

    if (!response.data) {
      throw new CheckTokenFailedException(`No data received`);
    }

    return response.data;
  }
}

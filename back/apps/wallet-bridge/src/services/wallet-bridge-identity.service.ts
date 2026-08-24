import { KoaContextWithOIDC } from 'oidc-provider';
import { v4 as uuid } from 'uuid';

import { Injectable } from '@nestjs/common';

import { AssetsService } from '@fc/app';
import { AsyncFunctionSafe, nowInSeconds } from '@fc/common';
import { ConfigService } from '@fc/config';
import { EudiDocTypes, EudiGenders, EudiPidClaimsDto } from '@fc/eudi';
import { EudiCogService } from '@fc/eudi-cog';
import { LoggerService } from '@fc/logger';
import { OidcIdentityDto } from '@fc/oidc';
import {
  OidcProviderAppConfigLibService,
  OidcProviderErrorService,
  OidcProviderGrantService,
  OidcProviderRuntimeException,
} from '@fc/oidc-provider';
import { Openid4vpInteractionDto, Openid4vpService } from '@fc/openid4vp';
import { SessionService } from '@fc/session';

import {
  WalletBridgeMultipleDocumentsFoundException,
  WalletBridgeNoDocumentFoundException,
} from '../exceptions';

@Injectable()
export class WalletBridgeIdentityService extends OidcProviderAppConfigLibService {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    protected readonly _logger: LoggerService,
    protected readonly sessionService: SessionService,
    protected readonly errorService: OidcProviderErrorService,
    protected readonly grantService: OidcProviderGrantService,
    protected readonly config: ConfigService,
    protected readonly assetsService: AssetsService,
    private readonly openid4vp: Openid4vpService,
    private readonly eudiCogService: EudiCogService,
  ) {
    super(
      _logger,
      sessionService,
      errorService,
      grantService,
      config,
      assetsService,
    );
  }

  async findAccount(
    _ctx: KoaContextWithOIDC,
    backendSessionId: string,
  ): Promise<{ accountId: string; claims: AsyncFunctionSafe }> {
    const interaction =
      await this.openid4vp.getInteractionByBackendId(backendSessionId);

    const openid4vpIdentity = this.extractIdentity(interaction);

    const oidcIdentity = this.convertPidToOidc(openid4vpIdentity);

    const sub = this.computeSub(backendSessionId, oidcIdentity);

    return {
      accountId: sub,
      claims: () => Promise.resolve({ sub, ...oidcIdentity }),
    };
  }

  async finishInteraction(
    req: any,
    res: any,
    interaction: Openid4vpInteractionDto,
  ): Promise<void> {
    /**
     * @todo compute more robust unique and secret id
     */
    const backendSessionId = uuid();

    const grant = await this.grantService.generateGrant(
      this.provider,
      req,
      res,
      backendSessionId,
    );

    const grantId = await this.grantService.saveGrant(grant);

    const result = {
      login: {
        acr: 'eidas3',
        accountId: backendSessionId,
        ts: nowInSeconds(),
        remember: false,
      },
      consent: {
        grantId,
      },
    };

    await this.openid4vp.bindInteractionToBackendId(
      backendSessionId,
      interaction,
    );

    try {
      await this.provider.interactionFinished(req, res, result);
    } catch (error) {
      await this.openid4vp.unbindInteractionFromBackendId(backendSessionId);
      throw new OidcProviderRuntimeException(error);
    }
  }

  /**
   * @todo compute a real sub ? business rules to be defined
   */
  private computeSub(
    backendSessionId: string,
    _identity: OidcIdentityDto,
  ): string {
    return backendSessionId;
  }

  private extractIdentity(
    interaction: Openid4vpInteractionDto,
  ): EudiPidClaimsDto {
    if (interaction.response.length === 0) {
      throw new WalletBridgeNoDocumentFoundException();
    } else if (interaction.response.length > 1) {
      throw new WalletBridgeMultipleDocumentsFoundException();
    }

    const document = interaction.response[0].claims as EudiPidClaimsDto;

    const claims = document[EudiDocTypes.PID];

    return claims;
  }

  private convertPidToOidc(pid: EudiPidClaimsDto): OidcIdentityDto {
    const { birthplace, birthcountry } = this.eudiCogService.resolveCog(
      pid.birth_place,
    );

    const result = {
      given_name: pid.given_name,
      family_name: pid.family_name,
      birthdate: pid.birth_date,
      gender: this.mapGender(pid.sex),
      birthplace,
      birthcountry,
      email: pid.email_address,
    };

    return result;
  }

  private mapGender(gender: EudiGenders): string {
    switch (gender) {
      case EudiGenders.MALE:
        return 'male';
      case EudiGenders.FEMALE:
        return 'female';
      default:
        return 'unspecified';
    }
  }
}

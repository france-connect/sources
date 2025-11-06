import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';

import { EnvironmentEnum, PublicationStatusEnum } from '@entities/typeorm';

import { wait } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  ActionTypes,
  ConfigCreateViaMessageDtoPayload,
  CreatedVia,
  CsmrConfigClientService,
} from '@fc/csmr-config-client';
import { LoggerService } from '@fc/logger';
import { ServiceProviderMetadata, stringToArray } from '@fc/oidc';
import {
  ClientTypeEnum,
  EncryptionAlgorithmEnum,
  EncryptionEncodingEnum,
  PlatformTechnicalKeyEnum,
  SignatureAlgorithmEnum,
} from '@fc/service-provider';
import { HUB_SIGN_HEADER, WebhooksService } from '@fc/webhooks';

import { WEBHOOK_NAME } from '../constants';
import { AppCliConfig } from '../dto';
import { ConsolidatedDataInterface, CsvInputInterface } from '../interfaces';

@Injectable()
export class ImportService {
  // More than 4 parameters in constructor is allowed for DI
  // eslint-disable-next-line max-params
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    @Inject('ConfigSandboxLow')
    private readonly configSandboxLow: CsmrConfigClientService,
    private readonly httpService: HttpService,
    private readonly webhooksService: WebhooksService,
  ) {}

  async diagnostic() {
    const { testInstanceId, testEmail } = this.config.get<AppCliConfig>('App');

    const result = await this.invite(testEmail, testInstanceId);

    if (result === false) {
      throw new Error('Diagnostic failed, can not invite');
    }
  }

  async import(
    dsData: CsvInputInterface[],
    dbData: ServiceProviderMetadata[],
  ): Promise<void> {
    const consolidatedData = this.consolidateData(dsData, dbData);

    for (const data of consolidatedData) {
      await wait(500);
      await this.publishAndInvite(data);
    }
  }

  private consolidateData(
    dsData: CsvInputInterface[],
    dbData: ServiceProviderMetadata[],
  ): ConsolidatedDataInterface[] {
    const data = dbData
      .map<ConsolidatedDataInterface>(this.consolidateItem.bind(this, dsData))
      .filter(Boolean);

    return data;
  }

  private consolidateItem(
    dsData: CsvInputInterface[],
    sp: ServiceProviderMetadata,
  ): ConsolidatedDataInterface | null {
    const dsItem = this.findServiceProviderByDatapassId(dsData, sp);

    if (!dsItem) {
      this.logger.warning({
        msg: 'No service Provider found in DS for datapassId',
        datapassId: sp.signupId,
      });

      return null;
    }

    return { email: dsItem.email, sp };
  }

  private findServiceProviderByDatapassId(
    dsData: CsvInputInterface[],
    sp: ServiceProviderMetadata,
  ): CsvInputInterface | undefined {
    // Prevent potential inconsistencies in database on datapassId field
    return dsData.find((ds) => `${ds.datapassId}` === `${sp.signupId}`);
  }
  /**
   * We still have some inconsistency between SPs transformed by @fc/service-provider-adapter-mongo
   * and SPs transformed by @fc/service-provider.
   * What should be done is use @fc/service-provider's fromLegacy() method in @fc/service-provider-adapter-mongo
   * but this out of scope for this task.
   */
  private formatSpForConsumer(
    sp: ServiceProviderMetadata,
  ): ConfigCreateViaMessageDtoPayload {
    const {
      active,
      claims,
      client_id,
      client_secret,
      entityId,
      identityConsent,
      name,
      post_logout_redirect_uris,
      redirect_uris,
      rep_scope,
      id_token_signed_response_alg,
      id_token_encrypted_response_enc,
      id_token_encrypted_response_alg,
      userinfo_encrypted_response_alg,
      userinfo_encrypted_response_enc,
      sector_identifier_uri,
      userinfo_signed_response_alg,
      platform,
      type,
      signupId,
      title,
    } = sp;

    return {
      active,
      claims,
      client_id,
      client_secret,
      entityId,
      identityConsent,
      idpFilterExclude: true,
      idpFilterList: [],
      name,
      post_logout_redirect_uris,
      redirect_uris,
      sector_identifier_uri,
      rep_scope,

      scope: stringToArray(sp.scope),
      environment: EnvironmentEnum.SANDBOX,

      // We need to cast some types due to the OIDC library being less strict with types than we are.
      id_token_encrypted_response_alg:
        id_token_encrypted_response_alg as EncryptionAlgorithmEnum,
      id_token_encrypted_response_enc:
        id_token_encrypted_response_enc as EncryptionEncodingEnum,
      id_token_signed_response_alg:
        id_token_signed_response_alg as SignatureAlgorithmEnum,
      userinfo_encrypted_response_alg:
        userinfo_encrypted_response_alg as EncryptionAlgorithmEnum,
      userinfo_encrypted_response_enc:
        userinfo_encrypted_response_enc as EncryptionEncodingEnum,
      userinfo_signed_response_alg:
        userinfo_signed_response_alg as SignatureAlgorithmEnum,
      type: type as ClientTypeEnum,
      platform: platform as PlatformTechnicalKeyEnum,
      signupId: signupId as string,
      title: title as string,

      createdVia: CreatedVia.COMMAND_IMPORT_SP_SANDBOX,
      createdBy: 'unknown-cli-user',
    };
  }

  private async publishAndInvite(
    data: ConsolidatedDataInterface,
  ): Promise<void> {
    const instanceId = uuid();
    const versionId = uuid();

    this.logger.info({
      msg: 'Publishing service provider',
      datapassId: data.sp.signupId,
      instanceId,
      versionId,
    });
    await this.publish(data.sp, instanceId, versionId);

    this.logger.info({
      msg: 'Inviting contact',
      datapassId: data.sp.signupId,
      instanceId,
      versionId,
    });
    await this.invite(data.email, instanceId);
  }

  private async publish(
    data: ServiceProviderMetadata,
    instanceId: string,
    versionId: string,
  ): Promise<void> {
    const message = {
      type: ActionTypes.CONFIG_CREATE,
      meta: {
        instanceId,
        versionId,
        publicationStatus: PublicationStatusEnum.PENDING,
      },
      payload: this.formatSpForConsumer(data),
    };

    await this.configSandboxLow.publish(message);
  }

  private async invite(
    email: string,
    instanceId: string,
  ): Promise<AxiosResponse<unknown> | false> {
    const { inviteEndpoint } = this.config.get<AppCliConfig>('App');

    const params = new URLSearchParams();
    params.append('emails[]', email);
    params.append('instances[]', instanceId);

    const payload = params.toString();

    const signature = this.webhooksService.sign(WEBHOOK_NAME, payload);

    let response;

    try {
      response = await lastValueFrom(
        this.httpService.post(inviteEndpoint, payload, {
          headers: {
            [HUB_SIGN_HEADER]: signature,
          },
        }),
      );

      if (response.status !== 201) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    } catch (error) {
      // Log but do not throw error
      // We want to continue the import process even if an error occurs during the invitation
      this.logger.warning({
        msg: 'Error while inviting user',
        error: error.message,
        email,
        instanceId,
      });

      return false;
    }

    return response;
  }
}

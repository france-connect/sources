import { Inject, Injectable } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';

import { PublicationStatusEnum } from '@entities/typeorm';

import { ConfigService } from '@fc/config';
import { diffKeys } from '@fc/config-abstract-adapter';
import { ConfigPublishedEvent } from '@fc/csmr-config';
import {
  ActionTypes as ConfigActionTypes,
  CsmrConfigClientService,
} from '@fc/csmr-config-client';
import {
  ActionTypes as ProxyActionTypes,
  CsmrProxyClientService,
} from '@fc/csmr-proxy-client';
import { OidcClientInterface } from '@fc/service-provider';

import { AppConfig } from '../dto';

@EventsHandler(ConfigPublishedEvent)
@Injectable()
export class ConfigPublishedEventHandler {
  constructor(
    @Inject('ConfigPartners')
    private readonly partnerClient: CsmrConfigClientService,
    @Inject('Proxy')
    private readonly proxyClient: CsmrProxyClientService,
    private readonly config: ConfigService,
  ) {}

  async handle(event: ConfigPublishedEvent) {
    const { updateProxy } = this.config.get<AppConfig>('App');

    if (updateProxy) {
      await this.updateProxy(event);
    }

    await this.updatePartner(event);
  }

  private async updatePartner(event: ConfigPublishedEvent) {
    const {
      payload: {
        message: { meta, payload },
      },
    } = event.properties;

    const statusMessage = {
      type: ConfigActionTypes.CONFIG_UPDATE,
      payload,
      meta: {
        ...meta,
        publicationStatus: PublicationStatusEnum.PUBLISHED,
      },
    };

    await this.partnerClient.publish(statusMessage);
  }

  private async updateProxy(event: ConfigPublishedEvent) {
    const {
      payload: {
        message: { payload },
      },
      meta: { diff, id },
    } = event.properties;

    if (!this.hasProxyRelatedDiff(diff)) {
      return;
    }

    const message = {
      type: ProxyActionTypes.PUT_URLS,
      payload: { urls: this.getProxyRelatedUrls(payload) },
      meta: {
        spId: id,
      },
    };
    await this.proxyClient.broadcast(message);
  }

  private hasProxyRelatedDiff(diff: (keyof OidcClientInterface)[]): boolean {
    const properties: diffKeys = ['sector_identifier_uri', 'jwks_uri'];

    const hasDiff = properties.some((property) => diff.includes(property));

    return hasDiff;
  }

  private getProxyRelatedUrls(version) {
    return [version.sector_identifier_uri, version.jwks_uri].filter(Boolean);
  }
}

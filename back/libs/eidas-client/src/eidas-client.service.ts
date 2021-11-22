import { Injectable } from '@nestjs/common';

import { ApacheIgniteService } from '@fc/apache-ignite';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import {
  EidasNameIdFormats,
  EidasPartialRequest,
  EidasRequest,
  EidasResponse,
  EidasSpTypes,
} from '@fc/eidas';
import { EidasCountries } from '@fc/eidas-country';
import {
  LightRequestService,
  LightResponseService,
} from '@fc/eidas-light-protocol';
import { LoggerService } from '@fc/logger';

import { EidasClientConfig } from './dto';
import {
  ReadLightResponseFromCacheException,
  WriteLightRequestInCacheException,
} from './exceptions';

@Injectable()
export class EidasClientService {
  private connectorRequestCache;
  private connectorResponseCache;

  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly apacheIgnite: ApacheIgniteService,
    private readonly crypto: CryptographyService,
    private readonly lightRequest: LightRequestService,
    private readonly lightResponse: LightResponseService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Retrieve the ignite caches for the connector:
   * connectorRequestCache -> write the FranceConnect request to the FR Node
   * connectorResponseCache -> read the provider country response from the FR Node
   */
  onModuleInit(): void {
    const { connectorRequestCache, connectorResponseCache } =
      this.config.get<EidasClientConfig>('EidasClient');

    this.logger.debug(
      `Accessing caches ${connectorRequestCache} and ${connectorResponseCache}...`,
    );

    /**
     * Cache can be prepared even if not connected to apache-ignite
     */
    this.connectorRequestCache = this.apacheIgnite.getCache(
      connectorRequestCache,
    );
    this.connectorResponseCache = this.apacheIgnite.getCache(
      connectorResponseCache,
    );
  }

  completeEidasRequest(
    eidasPartialRequest: EidasPartialRequest,
    citizenCountryCode: EidasCountries,
  ): EidasRequest {
    const { levelOfAssurance, requestedAttributes } = eidasPartialRequest;

    const eidasRequest: EidasRequest = {
      id: this.crypto.genRandomString(64),
      citizenCountryCode,
      issuer: 'EIDASBridge Connector',
      levelOfAssurance,
      nameIdFormat: EidasNameIdFormats.UNSPECIFIED,
      providerName: 'FranceConnect',
      spType: EidasSpTypes.PUBLIC,
      relayState: this.crypto.genRandomString(32),
      requestedAttributes,
    };

    return eidasRequest;
  }

  /**
   * Take a request as JSON and a light-request XML alongside its
   * light-request token
   * @param request The request as JSON
   * @returns The light-request token and the light-request as an XML
   */
  prepareLightRequest(requested: EidasRequest) {
    const { connectorRequestIssuer } =
      this.config.get<EidasClientConfig>('EidasClient');
    const token = this.lightRequest.generateToken(
      requested.id,
      connectorRequestIssuer,
    );
    const lightRequest = this.lightRequest.formatRequest(requested);

    return {
      token,
      lightRequest,
    };
  }

  /**
   * Take light-request as an XML to write to the ignite cache with
   * the given id as a key to retrieve it
   * @param id A unique id for the TTL of the light-request
   * @param lightRequest a light-request as an XML
   * @returns A void promise
   */
  async writeLightRequestInCache(
    id: string,
    lightRequest: string,
  ): Promise<void> {
    try {
      await this.connectorRequestCache.put(id, lightRequest);
    } catch (e) {
      throw new WriteLightRequestInCacheException();
    }
  }

  /**
   * Find the cache id to get the provider country light-response (XML) from the FR Node,
   * then returns the light-response or throw if an error occured.
   * @param token The light-response token to validate the source of the response
   * @returns The light-response as an XML
   */
  async readLightResponseFromCache(token: string): Promise<string> {
    const { id } = this.lightResponse.parseToken(token);

    try {
      return await this.connectorResponseCache.get(id);
    } catch (e) {
      throw new ReadLightResponseFromCacheException();
    }
  }

  /**
   * Parse an XML light-response to a more neutral and understandable JSON
   * @param lightResponse The light-response as an XML to parse
   * @returns The response as a more neutral and understandable JSON
   */
  parseLightResponse(lightResponse: string): EidasResponse {
    return this.lightResponse.parseResponse(lightResponse);
  }
}

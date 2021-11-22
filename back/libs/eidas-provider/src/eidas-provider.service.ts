import { Injectable } from '@nestjs/common';

import { ApacheIgniteService } from '@fc/apache-ignite';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { EidasNameIdFormats, EidasRequest, EidasResponse } from '@fc/eidas';
import {
  LightRequestService,
  LightResponseService,
} from '@fc/eidas-light-protocol';
import { LoggerService } from '@fc/logger';

import { EidasProviderConfig } from './dto';
import {
  ReadLightRequestFromCacheException,
  WriteLightResponseInCacheException,
} from './exceptions';

@Injectable()
export class EidasProviderService {
  private proxyServiceRequestCache;
  private proxyServiceResponseCache;

  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly crypto: CryptographyService,
    private readonly apacheIgnite: ApacheIgniteService,
    private readonly lightRequest: LightRequestService,
    private readonly lightResponse: LightResponseService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Retrieve the ignite caches for the proxy service:
   * proxyServiceRequestCache -> get the client country request from the FR Node
   * proxyServiceResponseCache -> write the FranceConnect response to the FR Node
   */
  onModuleInit(): void {
    const { proxyServiceRequestCache, proxyServiceResponseCache } =
      this.config.get<EidasProviderConfig>('EidasProvider');

    this.logger.debug(
      `Accessing caches ${proxyServiceRequestCache} and ${proxyServiceResponseCache}...`,
    );

    /*
     ** Cache can be prepared even if not connected to apache-ignite
     */
    this.proxyServiceRequestCache = this.apacheIgnite.getCache(
      proxyServiceRequestCache,
    );
    this.proxyServiceResponseCache = this.apacheIgnite.getCache(
      proxyServiceResponseCache,
    );
  }

  /**
   * Find the cache id to get the client country light-request (XML) from the FR Node,
   * then returns the light-request or throws if an error occured.
   * @param token The light-request token to validate the source of the request
   * @returns The light-request as an XML
   */
  async readLightRequestFromCache(token: string): Promise<string> {
    const { id } = this.lightRequest.parseToken(token);

    try {
      /**
       * We can't just return the promise as it will prevent any exception thrown by
       * "proxyServiceRequestCache.get" to be caught
       */
      const lightRequest = await this.proxyServiceRequestCache.get(id);
      return lightRequest;
    } catch (e) {
      throw new ReadLightRequestFromCacheException();
    }
  }

  /**
   * Parses an XML light-request to a more neutral and understandable JSON
   * @param lightRequest The light-request as an XML to parse
   * @returns The request as a more neutral and understandable JSON
   */
  parseLightRequest(lightRequest: string): EidasRequest {
    return this.lightRequest.parseRequest(lightRequest);
  }

  /**
   * Takes a partial success eidas response and add the missing
   * parts (id, issuer, ...)
   * @param partialEidasResponse The partial eidas response to complete
   * @return An complete successful eIDAS response
   */
  completeFcSuccessResponse(
    { subject, attributes, levelOfAssurance, status }: Partial<EidasResponse>,
    eidasRequest: EidasRequest,
  ): EidasResponse {
    const response = {
      id: this.crypto.genRandomString(64),
      issuer: 'FR EidasBridge - ProxyService',
      inResponseToId: eidasRequest.id,
      relayState: eidasRequest.relayState,
      subject,
      subjectNameIdFormat: EidasNameIdFormats.PERSISTENT,
      levelOfAssurance,
      status,
      attributes,
    };

    return response;
  }

  /**
   * Takes a partial fail eidas response and add the missing
   * parts (id, issuer, ...)
   * @param partialEidasResponse The partial eidas response to complete
   * @return An complete failure eIDAS response
   */
  completeFcFailureResponse(
    { status }: Partial<EidasResponse>,
    eidasRequest: EidasRequest,
  ) {
    const response = {
      id: this.crypto.genRandomString(64),
      issuer: 'FR EidasBridge - ProxyService',
      inResponseToId: eidasRequest.id,
      relayState: eidasRequest.relayState,
      status,
    };

    return response;
  }

  /**
   * Takes a response as JSON and a light-response XML alongside its
   * light-response token
   * @param response The response as JSON
   * @returns The light-response token and the light-response as an XML
   */
  prepareLightResponse(response: EidasResponse) {
    const { proxyServiceResponseIssuer } =
      this.config.get<EidasProviderConfig>('EidasProvider');
    const token = this.lightResponse.generateToken(
      response.id,
      proxyServiceResponseIssuer,
    );
    const lightResponse = this.lightResponse.formatResponse(response);

    return {
      token,
      lightResponse,
    };
  }

  /**
   * Takes light-response as an XML to write to the ignite cache with
   * the given id as a key to retrieve it
   * @param id A unique id for the TTL of the light-response
   * @param lightResponse a light-response as an XML
   * @returns A void promise
   */
  async writeLightResponseInCache(
    id: string,
    lightResponse: string,
  ): Promise<void> {
    try {
      await this.proxyServiceResponseCache.put(id, lightResponse);
    } catch (e) {
      throw new WriteLightResponseInCacheException();
    }
  }
}

import { KeyLike } from 'crypto';

import KeyStore from 'oidc-provider/lib/helpers/keystore.js';
import OidcProviderInstance from 'oidc-provider/lib/helpers/weak_cache.js';

import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { OidcProviderService } from '@fc/oidc-provider';

import { OverrideOidcProviderConfig } from '../dto';

@Injectable()
export class OverrideOidcProviderService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly moduleRef: ModuleRef,
  ) {}

  onApplicationBootstrap() {
    this.overrideJwksResponse();
  }

  /**
   * Override oidc-povider's JwksResponse with our public key from HSM
   *
   * This allow us to make `oidc-provider` to use the HSM provided public key
   * to check self issued signature (usefull on logout cinematic)
   *
   * This allow us to make `oidc-provider` publish the HSM provided public key
   * on /jwks discovery url.
   *
   * Note about the tricky part on `OidcProviderInstance`:
   * `oidc-provider` internally stores the "full" provider instance in a weakMap,
   * referenced by the object returned by the instantiation of the Provider class.
   * (take a deep breath...)
   *
   * The weakMap is acceed with a helper exported and used as `instance` in `oidc-provider` codebase.
   * To give more context, we prefixed the name in this module.
   */
  private overrideJwksResponse() {
    this.logger.notice('Overriding JwksResponse of "oidc-provider".');

    /** Grab HSM public sig key from configuration */
    const { sigHsmPubKeys } = this.config.get<OverrideOidcProviderConfig>(
      'OverrideOidcProvider',
    );

    const oidcProvider = this.getOidcProviderService();

    const provider = oidcProvider.getProvider();

    /** Get instance stored in `oidc-provider`'s internal weakMap */
    const instance = OidcProviderInstance(provider);

    const fakePrivKeys = sigHsmPubKeys.map((key: KeyLike) => {
      return { ...(key as object), d: 'not-a-private' };
    });

    instance.keystore = new KeyStore(fakePrivKeys as unknown as KeyLike[]);

    /** Override jwksResponse */
    instance.jwksResponse = { keys: sigHsmPubKeys };
  }

  private getOidcProviderService(): OidcProviderService {
    const allowGlobalScopeOptions = { strict: false };
    return this.moduleRef.get(OidcProviderService, allowGlobalScopeOptions);
  }
}

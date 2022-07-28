import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { ScopesConfig } from '../dto';
import {
  IClaimIndex,
  IProviderMappings,
  IRichClaims,
  IScopeIndex,
} from '../interfaces';
import { CONFIG_NAME } from '../tokens';

/**
 * This service exposes two optimized indexes to retrieves claims informations
 * from scopes or claims
 *
 * Beyond the two getters for indexes, all method are used to initialize index
 * and thus are private
 */
@Injectable()
export class ScopesIndexService {
  private claimIndex: IClaimIndex;
  private scopeIndex: IScopeIndex;

  constructor(
    @Inject(CONFIG_NAME) private readonly configName,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Initialize an in memory index to have a fast querying system on requests
   */
  onModuleInit() {
    const { mapping } = this.config.get<ScopesConfig>(this.configName);

    this.claimIndex = this.prepareClaimIndex(mapping);
    this.scopeIndex = this.prepareScopeIndex(mapping);

    this.logger.trace({
      claimIndex: this.claimIndex,
      scopeIndex: this.scopeIndex,
    });
  }

  get claims(): IClaimIndex {
    return this.claimIndex;
  }

  get scopes(): IScopeIndex {
    return this.scopeIndex;
  }

  private prepareClaimIndex(globalMapping: IProviderMappings[]): IClaimIndex {
    const index = {};

    globalMapping.forEach((mapping) => {
      const newValues = this.getRichClaimsForDataProvider(mapping);

      Object.assign(index, newValues);
    });

    return new Map(Object.entries(index));
  }

  private prepareScopeIndex(mappings: IProviderMappings[]): IScopeIndex {
    const index = {};
    mappings.forEach(({ scopes }) => {
      Object.assign(index, scopes);
    });

    return new Map(Object.entries(index));
  }

  private getRichClaimsForDataProvider(
    mappings: IProviderMappings,
  ): IRichClaims {
    const { claims, provider, labels } = mappings;
    const claimList = Object.values(claims);

    const data = claimList.map((identifier) => [
      identifier,
      { identifier, label: labels[identifier], provider },
    ]);

    return Object.fromEntries(data);
  }
}

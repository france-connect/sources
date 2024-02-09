import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { ScopesConfig } from '../dto';
import {
  IClaim,
  IClaimIndex,
  IProviderMappings,
  IRichClaim,
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
  ) {}

  /**
   * Initialize an in memory index to have a fast querying system on requests
   */
  onModuleInit() {
    const { mapping } = this.config.get<ScopesConfig>(this.configName);

    this.claimIndex = this.prepareClaimIndex(mapping);
    this.scopeIndex = this.prepareScopeIndex(mapping);
  }

  getClaim(key: string): IRichClaim {
    return this.indexGetter<IClaimIndex, IRichClaim>(
      this.claimIndex,
      'claim',
      key,
    );
  }

  getScope(key: string): IClaim[] {
    return this.indexGetter<IScopeIndex, IClaim[]>(
      this.scopeIndex,
      'scope',
      key,
    );
  }

  private indexGetter<Index extends Map<string, Value>, Value>(
    index: Index,
    indexName: string,
    key: string,
  ): Value {
    if (!index.has(key)) {
      this.logger.warning(
        `Entry not found in ${indexName} index for key ${key}`,
      );
    }

    return index.get(key);
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

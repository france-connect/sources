import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { ScopesConfig } from '../dto';
import {
  ClaimIndexInterface,
  ClaimInterface,
  ProviderMappingsInterface,
  RichClaimInterface,
  RichClaimsInterface,
  ScopeIndexInterface,
} from '../interfaces';
import { CONFIG_NAME } from '../tokens';

/**
 * This service exposes two optimized indexes to retrieves claims information
 * from scopes or claims
 *
 * Beyond the two getters for indexes, all method are used to initialize index
 * and thus are private
 */
@Injectable()
export class ScopesIndexService {
  private claimIndex: ClaimIndexInterface;
  private scopeIndex: ScopeIndexInterface;

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

  getClaim(key: string): RichClaimInterface {
    return this.indexGetter<ClaimIndexInterface, RichClaimInterface>(
      this.claimIndex,
      'claim',
      key,
    );
  }

  getScope(key: string): ClaimInterface[] {
    return this.indexGetter<ScopeIndexInterface, ClaimInterface[]>(
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

  private prepareClaimIndex(
    globalMapping: ProviderMappingsInterface[],
  ): ClaimIndexInterface {
    const index = {};

    globalMapping.forEach((mapping) => {
      const newValues = this.getRichClaimsForDataProvider(mapping);

      Object.assign(index, newValues);
    });

    return new Map(Object.entries(index));
  }

  private prepareScopeIndex(
    mappings: ProviderMappingsInterface[],
  ): ScopeIndexInterface {
    const index = {};
    mappings.forEach(({ scopes }) => {
      Object.assign(index, scopes);
    });

    return new Map(Object.entries(index));
  }

  private getRichClaimsForDataProvider(
    mappings: ProviderMappingsInterface,
  ): RichClaimsInterface {
    const { claims, provider } = mappings;
    const claimList = Object.values(claims);

    const data = claimList.map((identifier) => [
      identifier,
      { identifier, provider },
    ]);

    return Object.fromEntries(data);
  }
}

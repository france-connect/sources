import { Injectable } from '@nestjs/common';

import { CsmrAccountClientService } from '@fc/csmr-account-client';
import { PivotIdentityDto } from '@fc/oidc';
import { TracksAdapterElasticsearchService } from '@fc/tracks-adapter-elasticsearch';

import {
  TracksFormatterOutputInterface,
  TracksResultsInterface,
} from '../interfaces';

@Injectable()
export class CsmrFraudTracksService {
  constructor(
    private readonly account: CsmrAccountClientService,
    private readonly tracks: TracksAdapterElasticsearchService<TracksFormatterOutputInterface>,
  ) {}

  async getTracksForAuthenticationEventId(
    identity: PivotIdentityDto,
    authenticationEventId: string,
  ): Promise<TracksResultsInterface> {
    try {
      const accountIds = await this.account.getAccountIdsFromIdentity(identity);

      if (!accountIds.length) {
        return {
          error: `impossible de récupérer les account ids à partir de l’identité de l’usager`,
          total: 0,
          tracks: [],
        };
      }

      const { total, payload } =
        await this.tracks.getTracksForAuthenticationEventId(
          authenticationEventId,
        );

      if (total === 0) {
        return {
          error: `aucune trace ne correspond au code d’identitication`,
          total: 0,
          tracks: [],
        };
      }

      const tracks = payload.map(
        ({
          date,
          spName,
          idpName,
          idpSub,
          spSub,
          accountId,
          platform,
          interactionAcr,
          city,
          country,
          ipAddress,
        }) => {
          const accountIdMatch = accountIds.includes(accountId);
          return {
            date,
            spName,
            idpName,
            idpSub,
            spSub,
            accountIdMatch,
            platform,
            interactionAcr,
            city,
            country,
            ipAddress,
          };
        },
      );
      return { error: '', total, tracks };
    } catch (error) {
      return {
        error: `impossible de récupérer les traces à partir du code d’identification`,
        total: 0,
        tracks: [],
      };
    }
  }
}

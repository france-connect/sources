# TRACKS-ADAPTER-ELASTICSEARCH

## Objective

This library is designed to fetch tracks from Elasticsearch and format them according to specified output requirements.

- It is utilized by `csmr-tracks` to extract tracks based on a list of `accountIds`.
- It is utilized by `csmr-fraud` to extract tracks based on an `authenticationEventId`.

## Configuration

The library leverages three formatters and an interface to accurately format the Elasticsearch results.

**Example of importing the library in a module:**

```typescript
import { TracksOutputInterface } from '@fc/csmr-tracks-client';
import { TracksAdapterElasticsearchModule } from '@fc/tracks-adapter-elasticsearch';

import {
  TracksFcpHighFormatter,
  TracksFcpLowFormatter,
  TracksLegacyFormatter,
} from './formatters';

@Module({
  imports: [
    ...
    TracksAdapterElasticsearchModule.forRoot<TracksOutputInterface>(
      TracksFcpHighFormatter,
      TracksFcpLowFormatter,
      TracksLegacyFormatter,
  );
  ],
  controllers: [...],
  providers: [...],
})
```

**Example of core-v2 tracks formatter:**

```typescript
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { ScopesService } from '@fc/scopes';
import { TracksOutputInterface } from '@fc/csmr-tracks-client';
import { TracksV2FieldsInterface } from '@fc/elasticsearch';

import {
  TracksFormatterAbstract,
} from '@fc/tracks-adapter-elasticsearch';

import { Platform } from '../enums';
import { CsmrTracksTransformTracksFailedException } from '../exceptions';

@Injectable()
export class TracksV2Formatter
  implements TracksFormatterAbstract<TracksOutputInterface>
{
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
  ) {}

  formatTrack(
    rawTrack: SearchHit<TracksV2FieldsInterface>,
  ): TracksOutputInterface {
    this.logger.debug('Formatting tracks from core-v2');
    try {
      const { _source } = rawTrack;

      const output: TracksOutputInterface = {
        ...
      };

      return output;
    } catch (error) {
      throw new CsmrTracksTransformTracksFailedException(error);
    }
  }
}
```

## Usage

Use the asynchronous `getTracksForAccountIds` method to retrieve tracks for a list of accountIds:

```typescript
import { IPaginationOptions } from '@fc/common';
import { TracksAdapterElasticsearchService } from '@fc/tracks-adapter-elasticsearch';
import { TracksOutputInterface } from '@fc/csmr-tracks-client';

class Foo {
  constructor(
    private readonly tracks: TracksAdapterElasticsearchService<TracksOutputInterface>,
  ) {}

  async someMethod(accountIds: string[], options: IPaginationOptions) {
    const { total, payload } = await this.tracks.getTracksForAccountIds(
      accountIds,
      options,
    );

    console.log(payload);
  }
}
```

**Example of log output:**

```json
[
  {
    "event": "FC_REQUESTED_IDP_USERINFO",
    "claims": "['sub','gender','family_name'] | null",
    "time": "2022-06-17T11:58:51.643+02:00",
    "spLabel": "ANTS",
    "idpLabel": "Ameli",
    "platform": "FranceConnect",
    "interactionAcr": "eidas1",
    "country": "FR",
    "city": "Paris",
    "trackId": "fj8x83sBisV0DqyNyx-s",
    "authenticationEventId": "any-uuid-v4"
  }
]
```

Use the asynchronous `getTracksForAuthenticationEventId` method to retrieve tracks for an authenticationEventId:

```typescript
import { TracksAdapterElasticsearchService } from '@fc/tracks-adapter-elasticsearch';
import { TracksOutputInterface } from '../interfaces';

class Foo {
  constructor(
    private readonly tracks: TracksAdapterElasticsearchService<TracksOutputInterface>,
  ) {}

  async someMethod(authenticationEventId: string[]) {
    const { total, payload } =
      await this.tracks.getTracksForAuthenticationEventId(
        authenticationEventId,
      );

    console.log(payload);
  }
}
```

**Example of log output:**

```json
[
  {
    "date": "17/06/2022 11:58:51",
    "spName": "ANTS",
    "idpName": "Ameli",
    "platform": "FC (v1)",
    "country": "FR",
    "city": "Paris",
    "accountId": "any-string",
    "spSub": "any-string",
    "idpSub": "any-string",
    "interactionAcr": "eidas1",
    "ipAddress": ["ipAddress"]
  }
]
```

In case of error, the library will throw an exception rather than returning a falsy value.

**Library error scope number:** 55

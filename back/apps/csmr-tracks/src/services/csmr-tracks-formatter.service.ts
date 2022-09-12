import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { PLATFORM_V2_IDENTIFIER_TOKEN } from '../constants';
import { Platform } from '../enums';
import {
  IAppTracksDataService,
  ICsmrTracksData,
  ICsmrTracksFieldsRawData,
} from '../interfaces';
import { CsmrTracksHighDataService } from './csmr-tracks-data-high.service';
import { CsmrTracksLegacyDataService } from './csmr-tracks-data-legacy.service';

@Injectable()
export class CsmrTracksFormatterService {
  constructor(
    private readonly logger: LoggerService,
    private readonly formatterFcpHigh: CsmrTracksHighDataService,
    private readonly formatterLegacy: CsmrTracksLegacyDataService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public formatTracks(
    tracks: SearchHit<ICsmrTracksFieldsRawData>[],
  ): ICsmrTracksOutputTrack[] {
    const data = this.extractDataFromFields(tracks);

    const fcpHigh = this.generateTracks(
      data,
      Platform.FCP_HIGH,
      this.formatterFcpHigh,
    );

    const fcLegacy = this.generateTracks(
      data,
      Platform.FC_LEGACY,
      this.formatterLegacy,
    );

    const output = this.sortTracks([...fcpHigh, ...fcLegacy]);
    return output;
  }

  private homogenizeDataFields(
    fields: ICsmrTracksFieldsRawData,
  ): ICsmrTracksData {
    const entries = Object.entries(fields);
    const flattened = entries.map((field) => field.flat());
    const flattenedTrack = Object.fromEntries(flattened);

    const spLabel = flattenedTrack.fs_label || flattenedTrack.spName;
    const platform =
      flattenedTrack?.service === PLATFORM_V2_IDENTIFIER_TOKEN
        ? Platform.FCP_HIGH
        : Platform.FC_LEGACY;

    // @TODO cleanup useless props (spName, fs_label, service...)
    const result = { ...flattenedTrack, spLabel, platform };
    return result;
  }

  private extractDataFromFields(
    docs: SearchHit<ICsmrTracksFieldsRawData>[],
  ): ICsmrTracksData[] {
    const data = docs.map(({ _id, fields }) => {
      const entries = fields as ICsmrTracksFieldsRawData;
      const transformed = this.homogenizeDataFields(entries);
      const result = { trackId: _id, ...transformed };
      return result;
    });

    this.logger.trace({ fields: data });
    return data;
  }

  private generateTracks(
    data: ICsmrTracksData[],
    platform: Platform,
    formatter: IAppTracksDataService,
  ) {
    const selectedData: ICsmrTracksData[] = data.filter(
      (fields) => fields.platform === platform,
    );
    const output = formatter.formatTracks(selectedData);
    return output;
  }

  private sortTracks(
    groups: ICsmrTracksOutputTrack[],
  ): ICsmrTracksOutputTrack[] {
    this.logger.debug('Sort tracks');
    const sorted = groups.sort(({ time: a }, { time: b }) => a - b);
    this.logger.trace({ sorted });
    return sorted;
  }
}

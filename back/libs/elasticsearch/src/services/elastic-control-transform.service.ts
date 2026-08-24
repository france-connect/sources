import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { CoreInstance } from '@fc/tracks-adapter-elasticsearch';

import { DEFAULT_TIMEZONE } from '../constants';
import {
  ElasticControlConfig,
  ElasticControlTransformOptionsDto,
} from '../dto';
import {
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
  PIVOT_FIELDS,
  RANGE_TO_CALENDAR_INTERVAL,
  TransformStatesEnum,
} from '../enums';
import { ElasticControlInvalidRequestException } from '../exceptions';
import {
  TransformSourceInterface,
  TransformStatusInterface,
} from '../interfaces';
import {
  derivePeriod,
  getPeriodWindow,
  getTransformDocIndexed,
  getTransformLastCheckpoint,
  isNotFound,
} from '../utils';
import { ElasticControlClientService } from './elastic-control-client.service';
import { ElasticControlDestIndexService } from './elastic-control-dest-index.service';

@Injectable()
export class ElasticControlTransformService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly destIndex: ElasticControlDestIndexService,
    private readonly elastic: ElasticControlClientService,
  ) {}

  async findTransform(
    options: ElasticControlTransformOptionsDto,
  ): Promise<TransformStatusInterface | null> {
    try {
      const transformId = this.buildTransformId(options);
      const { transforms } = await this.elastic.getTransformStats(transformId);

      if (transforms.length === 0) {
        return null;
      }

      const [currentTransform] = transforms;
      const state = currentTransform.state;

      const lastCheckpoint = getTransformLastCheckpoint(currentTransform);
      const docsIndexed = getTransformDocIndexed(currentTransform);
      const reason = currentTransform.reason;

      return { id: transformId, state, lastCheckpoint, docsIndexed, reason };
    } catch (error) {
      throw new ElasticControlInvalidRequestException(error);
    }
  }

  async initializeTransform(
    options: ElasticControlTransformOptionsDto,
    dryRun: boolean,
  ): Promise<TransformStatusInterface> {
    const transformId = this.buildTransformId(options);

    await this.safeDeleteTransform(transformId, dryRun);
    await this.destIndex.safeDeleteDestIndex(transformId, dryRun);

    const body = this.buildTransformBody(options);

    await this.createTransform(transformId, body, dryRun);
    await this.startTransform(transformId, dryRun);

    return {
      id: transformId,
      state: TransformStatesEnum.STARTED,
      lastCheckpoint: 0,
      docsIndexed: 0,
    };
  }

  private async createTransform(
    transformId: string,
    body: Record<string, unknown>,
    dryRun: boolean,
  ): Promise<void> {
    if (dryRun) {
      this.logger.debug(
        `[transform] dry-run: would create transform "${transformId}"`,
      );
      return;
    }
    try {
      await this.elastic.createTransform(transformId, body);
      this.logger.debug(`[transform] Created transform "${transformId}"`);
    } catch (error) {
      throw new ElasticControlInvalidRequestException(error);
    }
  }

  private async startTransform(
    transformId: string,
    dryRun: boolean,
  ): Promise<void> {
    if (dryRun) {
      this.logger.debug(
        `[transform] dry-run: would start transform "${transformId}"`,
      );
      return;
    }

    try {
      await this.elastic.startTransform(transformId);
      this.logger.debug(`[transform] Started transform "${transformId}"`);
    } catch (error) {
      throw new ElasticControlInvalidRequestException(error);
    }
  }

  private async safeDeleteTransform(
    transformId: string,
    dryRun: boolean,
  ): Promise<void> {
    if (dryRun) {
      this.logger.debug(
        `[transform] dry-run: would delete transform "${transformId}"`,
      );
      return;
    }

    try {
      await this.elastic.stopTransform(transformId);
      this.logger.debug(`[transform] Stopped transform "${transformId}"`);

      await this.elastic.deleteTransform(transformId);
      this.logger.debug(`[transform] Deleted transform "${transformId}"`);
    } catch (error) {
      if (isNotFound(error)) {
        this.logger.debug(
          `[transform] Delete ignored: transform "${transformId}" not found (404)`,
        );
        return;
      }
      throw new ElasticControlInvalidRequestException(error);
    }
  }

  private buildTransformBody(
    options: ElasticControlTransformOptionsDto,
  ): Record<string, unknown> {
    const destIndex = this.buildTransformId(options);

    const pivotConfig = PIVOT_FIELDS[options.pivot];
    const { groupFields, nameFields } = pivotConfig;

    const { sourceIndex, filters } = this.buildSource(options, pivotConfig);
    // elastic defined property
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const group_by = this.buildGroupBy(groupFields, options);

    const metrics = nameFields.map((field) => ({ field }));

    return {
      source: {
        index: sourceIndex,
        query: {
          bool: {
            filter: filters,
          },
        },
      },
      dest: { index: destIndex },
      pivot: {
        // elastic defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        group_by,
        aggregations: {
          nbOfIdentities: { cardinality: { field: 'accountId' } },
          // elastic defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          nbOfConnections: { value_count: { field: 'accountId' } },
          info: {
            // elastic defined property
            // eslint-disable-next-line @typescript-eslint/naming-convention
            top_metrics: {
              metrics,
              sort: { time: 'desc' },
            },
          },
        },
      },
    };
  }

  private buildSource(
    options: ElasticControlTransformOptionsDto,
    pivotConfig: (typeof PIVOT_FIELDS)[ElasticControlPivotEnum],
  ): TransformSourceInterface {
    const { highTracksIndex, lowTracksIndex } =
      this.config.get<ElasticControlConfig>('ElasticControl');

    const PRODUCT_TO_INDEX = {
      [ElasticControlProductEnum.HIGH]: highTracksIndex,
      [ElasticControlProductEnum.LOW]: lowTracksIndex,
    };

    const PRODUCT_TO_SERVICE = {
      [ElasticControlProductEnum.HIGH]: CoreInstance.FCP_HIGH,
      [ElasticControlProductEnum.LOW]: CoreInstance.FCP_LOW,
    };

    const sourceIndex = PRODUCT_TO_INDEX[options.product];
    const service = PRODUCT_TO_SERVICE[options.product];

    const filters: Array<Record<string, unknown>> = [
      { term: { event: 'FC_VERIFIED' } },
      { term: { service } },
    ];

    const filterField = pivotConfig['filterField'];
    const filterValue = pivotConfig['filterValue'];

    if (filterField && filterValue) {
      filters.push({ term: { [filterField]: filterValue } });
    }

    filters.push(this.buildPeriodRangeFilter(options.range, options.period));

    return { sourceIndex, filters };
  }

  private buildPeriodRangeFilter(
    range: ElasticControlRangeEnum,
    period: string | undefined,
  ): Record<string, unknown> {
    const resolvedPeriod = period ?? derivePeriod(range);
    const { gte, lt } = getPeriodWindow(range, resolvedPeriod);

    return {
      range: {
        time: { gte: gte.getTime(), lt: lt.getTime() },
      },
    };
  }

  private buildGroupBy(
    groupFields: ReadonlyArray<string>,
    options: ElasticControlTransformOptionsDto,
  ): Record<string, unknown> {
    const groupBy: Record<string, unknown> = {};

    groupFields.forEach((field) => {
      groupBy[field] = { terms: { field } };
    });

    if (options.range !== ElasticControlRangeEnum.SEMESTER) {
      groupBy['period'] = this.buildDateHistogram(options.range);
    }

    return groupBy;
  }

  private buildDateHistogram(
    range: ElasticControlRangeEnum,
  ): Record<string, unknown> {
    const interval = RANGE_TO_CALENDAR_INTERVAL[range];

    if (!interval) {
      throw new ElasticControlInvalidRequestException();
    }

    return {
      // elastic defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
      date_histogram: {
        field: 'time',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        calendar_interval: interval,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        time_zone: DEFAULT_TIMEZONE,
      },
    };
  }

  buildTransformId(options: ElasticControlTransformOptionsDto): string {
    const { product, pivot, range } = options;
    return `runner_stats_${product}_${pivot}_${range}`;
  }
}

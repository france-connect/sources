import { omit } from 'lodash';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { ElasticControlConfig, ElasticControlReindexOptionsDto } from '../dto';
import { ElasticControlKeyEnum, OTHER_BY_KEY, PIVOT_FIELDS } from '../enums';
import { ElasticControlInvalidRequestException } from '../exceptions';
import { ReindexStatusInterface } from '../interfaces';
import { isNotFound, mapReindexFailures } from '../utils';
import { ElasticControlClientService } from './elastic-control-client.service';
import { ElasticControlTransformService } from './elastic-control-transform.service';

@Injectable()
export class ElasticControlReindexService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly transform: ElasticControlTransformService,
    private readonly elastic: ElasticControlClientService,
  ) {}

  async findTask(
    taskId: string,
    options: ElasticControlReindexOptionsDto,
  ): Promise<ReindexStatusInterface> {
    const totalReindex = await this.getReindexedMetrics(options);

    try {
      const { completed, response } = await this.elastic.getTask(taskId);

      return {
        id: taskId,
        completed: completed,
        total: totalReindex,
        failures: mapReindexFailures(response),
      };
    } catch (error) {
      if (!isNotFound(error)) {
        throw new ElasticControlInvalidRequestException(error);
      }
      return { id: taskId, completed: true, total: totalReindex, failures: [] };
    }
  }

  async initializeTask(
    options: ElasticControlReindexOptionsDto,
    dryRun: boolean,
  ): Promise<ReindexStatusInterface> {
    const transformOptions = omit(options, 'key');
    const sourceIndex = this.transform.buildTransformId(transformOptions);

    const pipelineId = await this.createPipeline(options, dryRun);
    const taskId = await this.startReindex(sourceIndex, pipelineId, dryRun);

    return { id: taskId, completed: false, total: 0, failures: [] };
  }

  private async createPipeline(
    options: ElasticControlReindexOptionsDto,
    dryRun: boolean,
  ): Promise<string> {
    const pipelineId = this.buildPipelineId(options);
    const pipelineBody = this.buildPipelineBody(options);

    if (dryRun) {
      this.logger.info(
        `[reindex] dry-run: would create ingest pipeline "${pipelineId}"`,
      );
      return pipelineId;
    }

    try {
      await this.elastic.putIngestPipeline(pipelineId, pipelineBody);
      this.logger.info(`[reindex] Created ingest pipeline "${pipelineId}"`);
    } catch (error) {
      throw new ElasticControlInvalidRequestException(error);
    }

    return pipelineId;
  }

  private async startReindex(
    sourceIndex: string,
    pipelineId: string,
    dryRun: boolean,
  ): Promise<string> {
    const { metricsIndex } =
      this.config.get<ElasticControlConfig>('ElasticControl');

    if (dryRun) {
      this.logger.info(
        `[reindex] dry-run: would start reindex task from "${sourceIndex}" -> "${metricsIndex}" using pipeline "${pipelineId}"`,
      );
      return;
    }

    try {
      const body = {
        source: { index: [sourceIndex] },
        dest: { index: metricsIndex, pipeline: pipelineId },
      };

      const { task: taskId } = await this.elastic.reindex(body);

      this.logger.info(`[reindex] Started reindex task "${taskId}" `);
      return taskId;
    } catch (error) {
      throw new ElasticControlInvalidRequestException(error);
    }
  }

  private buildPipelineId(options: ElasticControlReindexOptionsDto): string {
    const { timezone: _timezone, ...optionsWithoutTimezone } = options;
    const optionsKeys = Object.keys(optionsWithoutTimezone);
    const sortedOptions = optionsKeys
      .sort()
      .map((k) => optionsWithoutTimezone[k]);
    return sortedOptions.join('_');
  }

  private buildPipelineBody(
    options: ElasticControlReindexOptionsDto,
  ): Record<string, any> {
    const date = `${options.period}-01`;
    const keyToOmmit: ElasticControlKeyEnum = OTHER_BY_KEY[options.key];
    const { groupFields, nameFields } = PIVOT_FIELDS[options.pivot];

    const processors: Array<Record<string, unknown>> = [
      { set: { field: 'date', value: date } },
      { set: { field: 'key', value: options.key } },
      { set: { field: 'range', value: options.range } },
      { set: { field: 'product', value: options.product } },
      { set: { field: 'pivot', value: options.pivot } },
      {
        fingerprint: {
          fields: ['key', 'date', 'range', 'product', 'pivot', ...groupFields],
          // elastic defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          target_field: '_id',
          method: 'SHA-256',
        },
      },
      {
        rename: {
          field: options.key,
          // elastic defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          target_field: 'value',
        },
      },
    ];

    // Add rename processors for each name field
    nameFields.forEach((nameField) => {
      processors.push({
        rename: {
          field: `info.${nameField}`,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          target_field: nameField,
        },
      });
    });

    processors.push(
      { remove: { field: [keyToOmmit] } },
      { remove: { field: ['info'] } },
    );

    return {
      description: `create and format metrics for ${options.key}`,
      processors,
    };
  }

  private async getReindexedMetrics(
    options: ElasticControlReindexOptionsDto,
  ): Promise<number> {
    const { metricsIndex } =
      this.config.get<ElasticControlConfig>('ElasticControl');

    const date = `${options.period}-01`;
    const { groupFields } = PIVOT_FIELDS[options.pivot];

    // Build exists filters for all group fields
    const existsFilters = groupFields.map((field) => ({ exists: { field } }));

    const body = {
      query: {
        bool: {
          filter: [
            { term: { key: options.key } },
            { term: { product: options.product } },
            { term: { range: options.range } },
            { term: { date } },
            { term: { pivot: options.pivot } },
            ...existsFilters,
          ],
        },
      },
    };

    try {
      const { count = 0 } = await this.elastic.countDocuments(
        metricsIndex,
        body,
      );
      return count;
    } catch (error) {
      throw new ElasticControlInvalidRequestException(error);
    }
  }
}

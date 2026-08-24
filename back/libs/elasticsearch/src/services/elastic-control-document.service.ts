import { createHash } from 'crypto';

import { omit } from 'lodash';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import {
  ElasticControlConfig,
  ElasticControlReindexOptionsDto,
  ElasticControlTransformOptionsDto,
} from '../dto';
import { ControlStatesEnum, ElasticOperationsEnum } from '../enums';
import { ElasticControlInvalidRequestException } from '../exceptions';
import { ControlDocumentInterface } from '../interfaces';
import { isNotFound } from '../utils';
import { ElasticControlClientService } from './elastic-control-client.service';

@Injectable()
export class ElasticControlDocumentService {
  private readonly controlIndex: string;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly elastic: ElasticControlClientService,
  ) {
    const { controlIndex } =
      this.config.get<ElasticControlConfig>('ElasticControl');

    this.controlIndex = controlIndex;
  }

  async getOrCreateControlDoc(
    options:
      | ElasticControlTransformOptionsDto
      | ElasticControlReindexOptionsDto,
    operation: ElasticOperationsEnum,
    dryRun: boolean,
  ): Promise<ControlDocumentInterface> {
    const docId = this.buildControlDocId(operation, options);

    await this.ensureControlIndex(dryRun);

    const existing = await this.getControlDocById(docId);
    if (existing) return existing;

    this.logger.debug(`[control] Creating control document "${docId}"`);

    const initial = await this.createControlDoc(
      docId,
      operation,
      options,
      dryRun,
    );

    return initial;
  }

  private async createControlDoc(
    id: string,
    operation: ElasticOperationsEnum,
    options:
      | ElasticControlTransformOptionsDto
      | ElasticControlReindexOptionsDto,
    dryRun: boolean,
  ): Promise<ControlDocumentInterface> {
    const now = new Date().toISOString();

    const initial: ControlDocumentInterface = {
      id,
      operation,
      state: ControlStatesEnum.PENDING,
      createdAt: now,
      updatedAt: now,
      options: options,
    };

    if (dryRun) {
      this.logger.debug(
        `[control] dry-run: would create document "${id}" in index "${this.controlIndex}"`,
      );
      return initial;
    }

    try {
      await this.elastic.createDocument(this.controlIndex, id, initial);
      this.logger.debug(`[control] Created control document "${id}"`);

      return initial;
    } catch (error) {
      throw new ElasticControlInvalidRequestException(error);
    }
  }

  async updateControlDoc(
    doc: ControlDocumentInterface,
    nextState: ControlStatesEnum,
    status: Record<string, any>,
    dryRun: boolean,
  ): Promise<void> {
    const updated: ControlDocumentInterface = {
      ...doc,
      state: nextState,
      status,
      updatedAt: new Date().toISOString(),
    };

    if (dryRun) {
      this.logger.debug(
        `[control] dry-run: would update document "${doc.id}" state ${doc.state} -> ${nextState}`,
      );
      return;
    }

    try {
      await this.elastic.updateDocument(this.controlIndex, doc.id, updated);
      this.logger.debug(
        `[control] Updated document "${doc.id}" state ${doc.state} -> ${nextState}`,
      );
    } catch (error) {
      throw new ElasticControlInvalidRequestException(error);
    }
  }

  async countNonFinalOperations(
    operation: ElasticOperationsEnum,
  ): Promise<number> {
    const query = {
      query: {
        bool: {
          must: [
            { term: { operation } },
            {
              terms: {
                state: [ControlStatesEnum.PENDING, ControlStatesEnum.RUNNING],
              },
            },
          ],
        },
      },
    };

    try {
      const { count } = await this.elastic.countDocuments(
        this.controlIndex,
        query,
      );

      this.logger.debug(
        `[control] Non-final ${operation} operations: ${count}`,
      );

      return count;
    } catch (error) {
      throw new ElasticControlInvalidRequestException(error);
    }
  }

  async findRunningOperations(
    operation: ElasticOperationsEnum,
  ): Promise<ControlDocumentInterface[]> {
    const { runningOperationsMaxSize } =
      this.config.get<ElasticControlConfig>('ElasticControl');

    const query = {
      size: runningOperationsMaxSize,
      query: {
        bool: {
          must: [
            { term: { operation } },
            {
              term: {
                state: ControlStatesEnum.RUNNING,
              },
            },
          ],
        },
      },
    };

    try {
      const response = await this.elastic.searchDocuments(
        this.controlIndex,
        query,
      );

      const documents = response.hits.hits.map(
        (hit) => hit._source as ControlDocumentInterface,
      );

      this.logger.debug(
        `[control] Found ${documents.length} running ${operation} operations`,
      );

      return documents;
    } catch (error) {
      throw new ElasticControlInvalidRequestException(error);
    }
  }

  async getControlDocById(
    id: string,
  ): Promise<ControlDocumentInterface | null> {
    try {
      const { _source: source } = await this.elastic.getDocument(
        this.controlIndex,
        id,
      );
      return source as ControlDocumentInterface;
    } catch (error) {
      if (isNotFound(error)) return null;
      throw new ElasticControlInvalidRequestException(error);
    }
  }

  buildControlDocId(
    operation: ElasticOperationsEnum,
    options:
      | ElasticControlTransformOptionsDto
      | ElasticControlReindexOptionsDto,
  ): string {
    // A transform is unique per (product, range, pivot) triplet — only one
    // lives at a time and gets overwritten on each run. Excluding `period`
    // and `key` from the hash keeps a single control document per triplet
    // across periods, and lets the reindex (which carries `key`) look up
    // the matching transform doc without rebuilding the options shape.
    const hashable =
      operation === ElasticOperationsEnum.TRANSFORM
        ? omit(options, ['period', 'key'])
        : options;

    const optionsKeys = Object.keys(hashable);
    const sortedOptions = optionsKeys.sort().map((k) => hashable[k]);
    const payload = [operation, ...sortedOptions].join('.');
    const id = createHash('sha256').update(payload, 'utf8').digest('hex');
    return id;
  }

  private async ensureControlIndex(dryRun: boolean): Promise<void> {
    try {
      await this.elastic.getIndex(this.controlIndex);
      return;
    } catch (error) {
      if (!isNotFound(error))
        throw new ElasticControlInvalidRequestException(error);
    }

    this.logger.debug(`[control] Creating control index`);

    await this.createControlIndex(dryRun);
  }

  private async createControlIndex(dryRun: boolean): Promise<void> {
    const body = {
      settings: {
        // elastic defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        number_of_shards: 1,
        // elastic defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        number_of_replicas: 1,
      },
      mappings: {
        dynamic: 'strict',
        // elastic defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        dynamic_templates: [
          {
            keywords: {
              // elastic defined property
              // eslint-disable-next-line @typescript-eslint/naming-convention
              path_match: '{status,options}.*',
              // elastic defined property
              // eslint-disable-next-line @typescript-eslint/naming-convention
              match_mapping_type: 'string',
              mapping: { type: 'keyword' },
            },
          },
        ],
        _source: { enabled: true },
        properties: {
          id: { type: 'keyword' },
          operation: { type: 'keyword' },
          state: { type: 'keyword' },

          createdAt: { type: 'date' },
          updatedAt: { type: 'date' },

          options: { type: 'object', dynamic: true },
          status: { type: 'object', dynamic: true },
        },
      },
    };

    if (dryRun) {
      this.logger.debug(
        `[control] dry-run: would create index "${this.controlIndex}"`,
      );
      return;
    }

    try {
      await this.elastic.createIndex(this.controlIndex, body);
      this.logger.debug(`[control] Created index "${this.controlIndex}"`);
    } catch (error) {
      throw new ElasticControlInvalidRequestException(error);
    }
  }
}

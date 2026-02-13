import { plainToInstance } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { validationOptions } from '@fc/config';
import {
  ControlDocumentInterface,
  ControlStatesEnum,
  ElasticControlDocumentService,
  ElasticControlReindexOptionsDto,
  ElasticControlReindexService,
  ElasticControlTransformOptionsDto,
  ElasticOperationsEnum,
  ReindexStatusInterface,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { CommandElasticInvalidOptionsException } from '../exceptions';

@Injectable()
export class CommandElasticReindexService {
  constructor(
    private readonly logger: LoggerService,
    private readonly controlDocument: ElasticControlDocumentService,
    private readonly reindex: ElasticControlReindexService,
  ) {}

  async safeInitializeReindex(
    options: ElasticControlReindexOptionsDto,
    dryRun: boolean,
    force: boolean,
  ): Promise<void> {
    await this.validateOptions(options);

    this.logger.info(
      `[Command] Reindex initialization requested with options: ${JSON.stringify(options)}`,
    );

    const transformDoc = await this.fetchTransformDoc(options);

    this.logger.info(
      `[Command] Transform control document has state=${transformDoc?.state}`,
    );

    const shouldAbortDueToTransform =
      this.shouldAbortDueToTransformState(transformDoc);

    if (shouldAbortDueToTransform) {
      return;
    }

    const reindexDoc = await this.controlDocument.getOrCreateControlDoc(
      options,
      ElasticOperationsEnum.REINDEX,
      dryRun,
    );

    this.logger.info(
      `[Command] Reindex control document has state=${reindexDoc.state}`,
    );

    const shouldInitialize = this.shouldInitialize(reindexDoc, force);

    if (!shouldInitialize) {
      this.logger.info(
        `[Command] Aborting: reindex is already initialized, re-run with --force to restart`,
      );
      return;
    }

    this.logger.info(`[Command] Initializing reindex`);

    const initial = await this.reindex.initializeTask(options, dryRun);

    this.logger.info(`[Command] Updating control document`);

    await this.controlDocument.updateControlDoc(
      reindexDoc,
      ControlStatesEnum.RUNNING,
      initial,
      dryRun,
    );

    return;
  }

  private shouldAbortDueToTransformState(
    transformDoc: ControlDocumentInterface | null,
  ): boolean {
    if (transformDoc?.state !== ControlStatesEnum.COMPLETED) {
      this.logger.info(`[Command] Aborting: transform has not completed`);
      return true;
    }
    return false;
  }

  private shouldInitialize(
    reindexDoc: ControlDocumentInterface,
    force: boolean,
  ): boolean {
    return force || reindexDoc.state === ControlStatesEnum.PENDING;
  }

  async actualizeReindex(
    options: ElasticControlReindexOptionsDto,
    dryRun: boolean,
  ): Promise<void> {
    await this.validateOptions(options);

    this.logger.info(
      `[Command] Reindex actualisation requested with options: ${JSON.stringify(options)}`,
    );

    const reindexDoc = await this.fetchReindexDoc(options);

    this.logger.info(
      `[Command] Control document has state=${reindexDoc?.state}`,
    );

    if (reindexDoc?.state !== ControlStatesEnum.RUNNING) {
      this.logger.info(
        `[Command] Aborting: Control document is already in final state`,
      );
      return;
    }

    const target = await this.getReindexTarget(options);

    this.logger.info(`[Command] Reindex target=${target}`);

    const taskId = reindexDoc.status.id as string;
    const task = await this.reindex.findTask(taskId, options);

    this.logger.info(`[Command] Reindex total=${task.total}`);

    const nextState = this.getNextState(task, target);

    this.logger.info(`[Command] Updating control document`);

    await this.controlDocument.updateControlDoc(
      reindexDoc,
      nextState,
      task,
      dryRun,
    );
  }

  private getNextState(
    reindex: ReindexStatusInterface,
    target: number,
  ): ControlStatesEnum {
    if (reindex.completed === true) {
      if (reindex.total === target) {
        return ControlStatesEnum.COMPLETED;
      }
      return ControlStatesEnum.FAILED;
    }
    return ControlStatesEnum.RUNNING;
  }

  private async getReindexTarget(
    options: ElasticControlReindexOptionsDto,
  ): Promise<number> {
    const transformDoc = await this.fetchTransformDoc(options);
    const target = transformDoc?.status?.docsIndexed as number;

    return target;
  }

  private async fetchTransformDoc(
    options: ElasticControlReindexOptionsDto,
  ): Promise<ControlDocumentInterface | null> {
    const transformOptions = plainToInstance(
      ElasticControlTransformOptionsDto,
      options,
      { excludeExtraneousValues: true },
    );

    const transformDocId = this.controlDocument.buildControlDocId(
      ElasticOperationsEnum.TRANSFORM,
      transformOptions,
    );

    const transformDoc =
      await this.controlDocument.getControlDocById(transformDocId);

    return transformDoc;
  }

  private async fetchReindexDoc(
    options: ElasticControlReindexOptionsDto,
  ): Promise<ControlDocumentInterface | null> {
    const reindexDocId = this.controlDocument.buildControlDocId(
      ElasticOperationsEnum.REINDEX,
      options,
    );

    const reindexDoc =
      await this.controlDocument.getControlDocById(reindexDocId);

    return reindexDoc;
  }

  private async validateOptions(
    options: ElasticControlReindexOptionsDto,
  ): Promise<void> {
    const errors = await validateDto(
      options,
      ElasticControlReindexOptionsDto,
      validationOptions,
    );

    if (errors.length) {
      this.logger.info(
        `[Command] Aborting: invalid options: ${JSON.stringify(errors)}`,
      );
      throw new CommandElasticInvalidOptionsException();
    }
  }
}

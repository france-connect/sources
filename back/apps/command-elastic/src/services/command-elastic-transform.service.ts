import { Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { validationOptions } from '@fc/config';
import {
  ControlDocumentInterface,
  ControlStatesEnum,
  ElasticControlDocumentService,
  ElasticControlTransformOptionsDto,
  ElasticControlTransformService,
  ElasticOperationsEnum,
  TransformStatusInterface,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { CommandElasticInvalidOptionsException } from '../exceptions';
import { isTransformCompleted, isTransformRunning } from '../utils';

@Injectable()
export class CommandElasticTransformService {
  constructor(
    private readonly logger: LoggerService,
    private readonly transform: ElasticControlTransformService,
    private readonly controlDocument: ElasticControlDocumentService,
  ) {}

  async safeInitializeTransform(
    options: ElasticControlTransformOptionsDto,
    dryRun: boolean,
    force: boolean,
  ): Promise<void> {
    await this.validateOptions(options);

    this.logger.debug(
      `[Command] Transform initialization requested with options: ${JSON.stringify(options)}`,
    );

    const doc = await this.controlDocument.getOrCreateControlDoc(
      options,
      ElasticOperationsEnum.TRANSFORM,
      dryRun,
    );

    this.logger.debug(`[Command] Control document has state=${doc.state}`);

    const existing = await this.transform.findTransform(options);

    this.logger.debug(`[Command] Transform has state=${existing?.state}`);

    const shouldInitialize = this.shouldInitialize(doc, existing, force);

    if (!shouldInitialize) {
      this.logger.debug(
        `[Command] Aborting: transform is already initialized, re-run with --force to restart`,
      );
      return;
    }

    this.logger.debug(`[Command] Initializing transform`);

    const initial = await this.transform.initializeTransform(options, dryRun);

    this.logger.debug(`[Command] Updating control document`);

    await this.controlDocument.updateControlDoc(
      doc,
      ControlStatesEnum.RUNNING,
      initial,
      dryRun,
    );

    return;
  }

  private shouldInitialize(
    controlDoc: ControlDocumentInterface,
    transform: TransformStatusInterface | null,
    force: boolean,
  ): boolean {
    return (
      force || (!transform && controlDoc.state === ControlStatesEnum.PENDING)
    );
  }

  async actualizeTransform(
    options: ElasticControlTransformOptionsDto,
    dryRun: boolean,
  ): Promise<void> {
    await this.validateOptions(options);

    this.logger.debug(
      `[Command] Transform actualisation requested with options: ${JSON.stringify(options)}`,
    );

    const doc = await this.fetchTransformDoc(options);

    this.logger.debug(`[Command] Control document has state=${doc?.state}`);

    const existing = await this.transform.findTransform(options);

    this.logger.debug(`[Command] Transform has state=${existing?.state}`);

    const shouldActualize = this.shouldActualize(doc);

    if (!shouldActualize) {
      this.logger.debug(
        `[Command] Aborting: Control document is already in final state, or transform is not found`,
      );
      return;
    }

    const nextState = this.getNextState(existing);

    this.logger.debug(`[Command] Updating control document`);

    await this.controlDocument.updateControlDoc(
      doc,
      nextState,
      existing,
      dryRun,
    );
  }

  private shouldActualize(controlDoc: ControlDocumentInterface): boolean {
    return controlDoc.state === ControlStatesEnum.RUNNING;
  }

  private getNextState(
    transform?: TransformStatusInterface,
  ): ControlStatesEnum {
    if (!transform) {
      return ControlStatesEnum.FAILED;
    }

    if (isTransformCompleted(transform)) {
      return ControlStatesEnum.COMPLETED;
    }

    if (isTransformRunning(transform)) {
      return ControlStatesEnum.RUNNING;
    }

    return ControlStatesEnum.FAILED;
  }

  private async fetchTransformDoc(
    options: ElasticControlTransformOptionsDto,
  ): Promise<ControlDocumentInterface | null> {
    const transformDocId = this.controlDocument.buildControlDocId(
      ElasticOperationsEnum.TRANSFORM,
      options,
    );

    const transformDoc =
      await this.controlDocument.getControlDocById(transformDocId);

    return transformDoc;
  }

  private async validateOptions(
    options: ElasticControlTransformOptionsDto,
  ): Promise<void> {
    const errors = await validateDto(
      options,
      ElasticControlTransformOptionsDto,
      validationOptions,
    );

    if (errors.length) {
      this.logger.debug(
        `[Command] Aborting: invalid options: ${JSON.stringify(errors)}`,
      );
      throw new CommandElasticInvalidOptionsException();
    }
  }
}

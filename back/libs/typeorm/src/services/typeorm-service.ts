import { DataSource, QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import {
  TypeormQueryRunnerFailedException,
  TypeormTransactionFailedException,
} from '../exceptions';

@Injectable()
export class TypeormService {
  constructor(private readonly dataSource: DataSource) {}

  async withTransaction<T>(
    callback: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner);
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new TypeormTransactionFailedException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async withQueryRunner<T>(
    callback: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      return await callback(queryRunner);
    } catch (error) {
      throw new TypeormQueryRunnerFailedException(error);
    } finally {
      await queryRunner.release();
    }
  }
}

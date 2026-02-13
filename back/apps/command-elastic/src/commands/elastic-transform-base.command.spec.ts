import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { CommandElasticTransformService } from '../services';
import { ElasticTransformBaseCommand } from './elastic-transform-base.command';

describe('ElasticTransformBaseCommand', () => {
  let command: ElasticTransformBaseCommand;

  class CommandTest extends ElasticTransformBaseCommand {
    async run(): Promise<void> {
      return await Promise.resolve();
    }
  }

  const loggerMock = getLoggerMock();
  const transformMock = {};

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandTest, CommandElasticTransformService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CommandElasticTransformService)
      .useValue(transformMock)
      .compile();

    command = module.get<CommandTest>(CommandTest);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  describe('parseProduct', () => {
    it('should return the provided string value', () => {
      // Given
      const productValue = 'productMock';

      // When
      const result = command.parseProduct(productValue);

      // Then
      expect(result).toBe(productValue);
    });
  });

  describe('parseRange', () => {
    it('should return the provided string value', () => {
      // Given
      const rangeValue = 'rangeMock';

      // When
      const result = command.parseRange(rangeValue);

      // Then
      expect(result).toBe(rangeValue);
    });
  });

  describe('parsePivot', () => {
    it('should return the provided string value', () => {
      // Given
      const pivotValue = 'pivotMock';

      // When
      const result = command.parsePivot(pivotValue);

      // Then
      expect(result).toBe(pivotValue);
    });
  });

  describe('parsePeriod', () => {
    it('should return the provided string value', () => {
      // Given
      const periodValue = '2025-01';

      // When
      const result = command.parsePeriod(periodValue);

      // Then
      expect(result).toBe(periodValue);
    });
  });

  describe('parseDryRun', () => {
    it('should return true', () => {
      // When
      const result = command.parseDryRun();

      // Then
      expect(result).toBe(true);
    });
  });

  describe('parseForce', () => {
    it('should return true', () => {
      // When
      const result = command.parseForce();

      // Then
      expect(result).toBe(true);
    });
  });
});

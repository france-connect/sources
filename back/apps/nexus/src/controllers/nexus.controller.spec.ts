import { Test, TestingModule } from '@nestjs/testing';

import { NexusController } from './nexus.controller';

describe('NexusController', () => {
  let nexusController: NexusController;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NexusController],
    }).compile();

    nexusController = module.get<NexusController>(NexusController);
  });

  it('should be defined', () => {
    expect(nexusController).toBeDefined();
  });

  describe('getIndex', () => {
    it('should return the OK status', () => {
      // When
      const result = nexusController.getIndex();

      // Then
      expect(result).toEqual({ status: 'OK' });
    });
  });
});

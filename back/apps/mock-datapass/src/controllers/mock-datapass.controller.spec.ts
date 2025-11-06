import { Test, TestingModule } from '@nestjs/testing';

import { PostWebhookBodyDto } from '../dto';
import { MockDatapassService } from '../services';
import { MockDatapassController } from './mock-datapass.controller';

describe('MockDatapassController', () => {
  let controller: MockDatapassController;

  const mockDatapassService = {
    handleWebhook: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [MockDatapassController],
      providers: [MockDatapassService],
    })
      .overrideProvider(MockDatapassService)
      .useValue(mockDatapassService)

      .compile();

    controller = app.get<MockDatapassController>(MockDatapassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getIndex', () => {
    it('should not return anything', () => {
      // When
      const result = controller.getIndex();

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('postWebhook', () => {
    it('should call MockDatapassService.handleWebhook with the correct event', async () => {
      // Given
      const body = { event: 'eventMock' } as PostWebhookBodyDto;
      const expectedEvent = 'eventMock';

      // When
      await controller.postWebhook(body);

      // Then
      expect(mockDatapassService.handleWebhook).toHaveBeenCalledWith(
        expectedEvent,
      );
    });
  });
});

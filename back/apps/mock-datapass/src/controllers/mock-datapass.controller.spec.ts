import { Test, TestingModule } from '@nestjs/testing';

import { PostWebhookBodyDto } from '../dto';
import { MockDatapassService } from '../services';
import { MockDatapassController } from './mock-datapass.controller';

describe('MockDatapassController', () => {
  let controller: MockDatapassController;
  const payloadPresets = [
    {
      id: 'success',
      label: 'Payload Succès',
      payload: '{"event":"approve"}',
    },
    {
      id: 'failure',
      label: 'Payload Échec',
      payload: '{"event":"approve","fired_at":"not_a_number"}',
    },
  ];

  const mockDatapassService = {
    handleWebhook: jest.fn(),
    getPayloadPresets: jest.fn(),
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
    it('should return payload presets and use the first one as default payload', () => {
      // Given
      mockDatapassService.getPayloadPresets.mockReturnValue(payloadPresets);

      // When
      const result = controller.getIndex();

      // Then
      expect(result).toEqual({
        payloadPresets,
        defaultPayload: payloadPresets[0].payload,
      });
      expect(mockDatapassService.getPayloadPresets).toHaveBeenCalledTimes(1);
    });

    it('should return an empty default payload when no preset is available', () => {
      // Given
      mockDatapassService.getPayloadPresets.mockReturnValue([]);

      // When
      const result = controller.getIndex();

      // Then
      expect(result).toEqual({
        payloadPresets: [],
        defaultPayload: '',
      });
      expect(mockDatapassService.getPayloadPresets).toHaveBeenCalledTimes(1);
    });
  });

  describe('postWebhook', () => {
    it('should call MockDatapassService.handleWebhook with the payload', async () => {
      // Given
      const expectedPayload = '{"event":"approve"}';
      const body = {
        payload: expectedPayload,
      } as PostWebhookBodyDto;

      // When
      await controller.postWebhook(body);

      // Then
      expect(mockDatapassService.handleWebhook).toHaveBeenCalledWith(
        expectedPayload,
      );
    });

    it('should return the result from handleWebhook', async () => {
      // Given
      const body = {
        payload: '{"event":"approve"}',
      } as PostWebhookBodyDto;
      const expectedResult = { status: 201, data: {} };
      mockDatapassService.handleWebhook.mockResolvedValue(expectedResult);

      // When
      const result = await controller.postWebhook(body);

      // Then
      expect(result).toBe(expectedResult);
    });
  });
});

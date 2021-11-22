import { Test, TestingModule } from '@nestjs/testing';

import { FeatureHandlerNoHandler } from './feature-handler-no-handler.handler';

describe('FeatureHandlerNoHandler', () => {
  let service: FeatureHandlerNoHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeatureHandlerNoHandler],
    }).compile();

    service = module.get<FeatureHandlerNoHandler>(FeatureHandlerNoHandler);
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    it('should return a `Promise`', async () => {
      // When
      const result = service.handle();
      await result;
      // Then
      expect(result).toBeInstanceOf(Promise);
    });

    it('should return a null value', async () => {
      // Given
      const result = service.handle();
      await result;
      // Then
      expect(result).resolves.toEqual(null);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { MockRnippService } from '../services/mock-rnipp.service';
import { MockRnippController } from './mock-rnipp.controller';

describe('MockRnippController', () => {
  let mockRnippController: MockRnippController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MockRnippController],
      providers: [MockRnippService],
    }).compile();

    mockRnippController = app.get<MockRnippController>(MockRnippController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mockRnippController.getHello()).toBe('Hello World!');
    });
  });
});

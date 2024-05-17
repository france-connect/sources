import { Test, TestingModule } from '@nestjs/testing';

import { PartnersService } from '../services/partners.service';
import { PartnersController } from './partners.controller';

describe('PartnersFcaController', () => {
  let partnersFcaController: PartnersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PartnersController],
      providers: [PartnersService],
    }).compile();

    partnersFcaController = app.get<PartnersController>(PartnersController);
  });

  describe('root', () => {
    it('should return "Hello Partners FC!"', () => {
      expect(partnersFcaController.getHello()).toBe('Hello Partners FC!');
    });
  });
});

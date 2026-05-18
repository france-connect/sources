import { Test, TestingModule } from '@nestjs/testing';

import { StaticPagesController } from './static-pages.controller';

describe('StaticPagesController', () => {
  let staticPagesController: StaticPagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaticPagesController],
    }).compile();

    staticPagesController = module.get<StaticPagesController>(
      StaticPagesController,
    );
  });

  describe('getLegalNotice()', () => {
    it('should render the legal-notice view', () => {
      // Given
      const resMock = {
        render: jest.fn(),
      };
      const renderResult = Symbol('renderResult');
      resMock.render.mockReturnValue(renderResult);

      // When
      const result = staticPagesController.getLegalNotice(resMock);

      // Then
      expect(resMock.render).toHaveBeenCalledExactlyOnceWith('legal-notice');
      expect(result).toBe(renderResult);
    });
  });
});

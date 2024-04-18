import { Test, TestingModule } from '@nestjs/testing';

import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { FlowStepsService } from './flow-steps.service';

describe('FlowStepsService', () => {
  let service: FlowStepsService;

  const sessionMock = getSessionServiceMock();
  const stepRoute = Symbol('stepRoute') as unknown as string;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FlowStepsService, SessionService],
    })
      .overrideProvider(SessionService)
      .useValue(sessionMock)
      .compile();

    service = module.get<FlowStepsService>(FlowStepsService);
  });

  describe('setStep', () => {
    it('should set session stepRoute with given argument', () => {
      // When
      service.setStep(stepRoute);

      // Then
      expect(sessionMock.set).toHaveBeenCalledTimes(1);
      expect(sessionMock.set).toHaveBeenCalledWith(
        'OidcClient',
        'stepRoute',
        stepRoute,
      );
    });
  });
});

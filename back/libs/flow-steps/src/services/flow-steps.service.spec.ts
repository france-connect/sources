import { Test, TestingModule } from '@nestjs/testing';

import { OidcSession } from '@fc/oidc';
import { ISessionRequest, ISessionService, SessionService } from '@fc/session';

import { FlowStepsService } from './flow-steps.service';

describe('FlowStepsService', () => {
  let service: FlowStepsService;

  const sessionMock = {
    set: jest.fn(),
  } as unknown as ISessionService<OidcSession>;

  const reqMock = {} as unknown as ISessionRequest;
  const stepRoute = Symbol('stepRoute') as unknown as string;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FlowStepsService],
    }).compile();

    service = module.get<FlowStepsService>(FlowStepsService);
    jest
      .spyOn(SessionService, 'getBoundSession')
      .mockImplementation(() => sessionMock);
  });

  describe('setStep', () => {
    it('should get session from SessionService.getBoundSession', async () => {
      // When
      await service.setStep(reqMock, stepRoute);

      // Then
      expect(SessionService.getBoundSession).toHaveBeenCalledTimes(1);
      expect(SessionService.getBoundSession).toHaveBeenCalledWith(
        reqMock,
        'OidcClient',
      );
    });

    it('should set session stepRoute with given argument', async () => {
      // When
      await service.setStep(reqMock, stepRoute);

      // Then
      expect(sessionMock.set).toHaveBeenCalledTimes(1);
      expect(sessionMock.set).toHaveBeenCalledWith('stepRoute', stepRoute);
    });
  });
});

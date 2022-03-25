import { ExecutionContext } from '@nestjs/common';

import { SessionService } from '../services';
import { extractSessionFromRequest } from './session.decorator';

describe('extractSessionFromRequest', () => {
  const executionCtxMock = {
    switchToHttp: jest.fn(),
    getRequest: jest.fn(),
  };

  const moduleNameMock = 'moduleName';

  const reqMock = {
    sessionId: 'sessionId',
    sessionService: {
      get: jest.fn(),
      set: jest.fn(),
    },
  };

  beforeEach(() => {
    executionCtxMock.switchToHttp.mockReturnValueOnce(executionCtxMock);
    executionCtxMock.getRequest.mockReturnValueOnce(reqMock);

    reqMock.sessionService.get.bind = jest.fn().mockReturnValueOnce('get');
    reqMock.sessionService.set.bind = jest.fn().mockReturnValueOnce('set');
  });

  it('should get the request from the execution context', () => {
    // action
    extractSessionFromRequest(
      moduleNameMock,
      executionCtxMock as unknown as ExecutionContext,
    );

    // expect
    expect(executionCtxMock.switchToHttp).toHaveBeenCalledTimes(1);
    expect(executionCtxMock.switchToHttp).toHaveBeenCalledWith();
    expect(executionCtxMock.getRequest).toHaveBeenCalledTimes(1);
    expect(executionCtxMock.getRequest).toHaveBeenCalledWith();
  });

  it('should bind the session service "get" and "set" functions using "SessionService.getBoundedSession"', () => {
    // setup
    jest.spyOn(SessionService, 'getBoundedSession');

    // action
    extractSessionFromRequest(
      moduleNameMock,
      executionCtxMock as unknown as ExecutionContext,
    );

    // expect
    expect(SessionService.getBoundedSession).toHaveBeenCalledTimes(1);
    expect(SessionService.getBoundedSession).toHaveBeenCalledWith(
      reqMock,
      moduleNameMock,
    );
  });
});

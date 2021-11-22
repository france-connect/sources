import { ExecutionContext } from '@nestjs/common';

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

  const boundSessionContextMock = {
    sessionId: reqMock.sessionId,
    moduleName: moduleNameMock,
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

  it('should bind the session service get function with the session service and the sessionContext', () => {
    // action
    extractSessionFromRequest(
      moduleNameMock,
      executionCtxMock as unknown as ExecutionContext,
    );

    // expect
    expect(reqMock.sessionService.get.bind).toHaveBeenCalledTimes(1);
    expect(reqMock.sessionService.get.bind).toHaveBeenCalledWith(
      reqMock.sessionService,
      boundSessionContextMock,
    );
  });

  it('should bind the session service set function with the session service and the sessionContext', () => {
    // action
    extractSessionFromRequest(
      moduleNameMock,
      executionCtxMock as unknown as ExecutionContext,
    );

    // expect
    expect(reqMock.sessionService.set.bind).toHaveBeenCalledTimes(1);
    expect(reqMock.sessionService.set.bind).toHaveBeenCalledWith(
      reqMock.sessionService,
      boundSessionContextMock,
    );
  });

  it('should return the bounded functions (mocked as string for the test)', () => {
    // action
    const expected = {
      get: 'get',
      set: 'set',
    };

    const result = extractSessionFromRequest(
      moduleNameMock,
      executionCtxMock as unknown as ExecutionContext,
    );

    // expect
    expect(result).toStrictEqual(expected);
  });
});

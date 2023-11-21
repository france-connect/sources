import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { ISessionRequest, ISessionService, SessionService } from '@fc/session';

import { getSessionServiceMock } from '../../.mocks';
import * as extractSessionHelper from './extract-session.helper';

describe('extractSessionHelper', () => {
  const moduleNameMock = 'moduleNameMock';

  const reqMock = {
    sessionId: 'sessionId',
    sessionService: getSessionServiceMock(),
  } as unknown as ISessionRequest;

  const httpCtxMock = {
    getRequest: jest.fn(),
  } as unknown as HttpArgumentsHost;

  const ctxMock = {
    switchToHttp: jest.fn(),
  } as unknown as ExecutionContext;

  const boundSessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
  } as unknown as ISessionService<unknown>;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('extractSessionFromRequest', () => {
    it('should retrieve the session service bound to the right module', () => {
      // setup
      const spy = jest.spyOn(SessionService, 'getBoundSession');
      // action
      extractSessionHelper.extractSessionFromRequest(moduleNameMock, reqMock);

      // expect
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(reqMock, moduleNameMock);
    });

    it('should return the bound session service', () => {
      jest
        .spyOn(SessionService, 'getBoundSession')
        .mockReturnValueOnce(boundSessionServiceMock);
      // action
      const result = extractSessionHelper.extractSessionFromRequest(
        moduleNameMock,
        reqMock,
      );

      // expect
      expect(result).toBe(boundSessionServiceMock);
    });
  });

  describe('extractSessionFromContext', () => {
    beforeEach(() => {
      jest.mocked(ctxMock.switchToHttp).mockReturnValueOnce(httpCtxMock);
      jest.mocked(httpCtxMock.getRequest).mockReturnValueOnce(reqMock);
      jest
        .spyOn(SessionService, 'getBoundSession')
        .mockReturnValueOnce(boundSessionServiceMock);
    });

    it('should switch to http context', () => {
      // action
      extractSessionHelper.extractSessionFromContext(moduleNameMock, ctxMock);

      // expect
      expect(ctxMock.switchToHttp).toHaveBeenCalledTimes(1);
      expect(ctxMock.switchToHttp).toHaveBeenCalledWith();
    });

    it('should retrieve the request from the http context', () => {
      // action
      extractSessionHelper.extractSessionFromContext(moduleNameMock, ctxMock);

      // expect
      expect(httpCtxMock.getRequest).toHaveBeenCalledTimes(1);
      expect(httpCtxMock.getRequest).toHaveBeenCalledWith();
    });

    it('should return the bound session service', () => {
      // action
      const result = extractSessionHelper.extractSessionFromContext(
        moduleNameMock,
        ctxMock,
      );

      // expect
      expect(result).toBe(boundSessionServiceMock);
    });
  });
});

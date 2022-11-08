import { IncomingMessage } from 'http';
import { mocked } from 'jest-mock';

import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { ISessionService, SessionService } from '@fc/session';

import * as extractSessionHelper from './extract-session.helper';

describe('extractSessionHelper', () => {
  const moduleNameMock = 'moduleNameMock';

  const reqMock = {
    sessionId: 'sessionId',
    sessionService: {
      get: jest.fn(),
      set: jest.fn(),
    },
  } as unknown as IncomingMessage;

  const httpCtxMock = {
    getRequest: jest.fn(),
  } as unknown as HttpArgumentsHost;

  const ctxMock = {
    switchToHttp: jest.fn(),
  } as unknown as ExecutionContext;

  const boundedSessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
  } as unknown as ISessionService<unknown>;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('extractSessionFromRequest', () => {
    it('should retrieve the session service bounded to the right module', () => {
      // setup
      const spy = jest.spyOn(SessionService, 'getBoundedSession');
      // action
      extractSessionHelper.extractSessionFromRequest(moduleNameMock, reqMock);

      // expect
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(reqMock, moduleNameMock);
    });

    it('should return the bounded session service', () => {
      jest
        .spyOn(SessionService, 'getBoundedSession')
        .mockReturnValueOnce(boundedSessionServiceMock);
      // action
      const result = extractSessionHelper.extractSessionFromRequest(
        moduleNameMock,
        reqMock,
      );

      // expect
      expect(result).toBe(boundedSessionServiceMock);
    });
  });

  describe('extractSessionFromContext', () => {
    beforeEach(() => {
      mocked(ctxMock.switchToHttp).mockReturnValueOnce(httpCtxMock);
      mocked(httpCtxMock.getRequest).mockReturnValueOnce(reqMock);
      jest
        .spyOn(SessionService, 'getBoundedSession')
        .mockReturnValueOnce(boundedSessionServiceMock);
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

    it('should return the bounded session service', () => {
      // action
      const result = extractSessionHelper.extractSessionFromContext(
        moduleNameMock,
        ctxMock,
      );

      // expect
      expect(result).toBe(boundedSessionServiceMock);
    });
  });
});

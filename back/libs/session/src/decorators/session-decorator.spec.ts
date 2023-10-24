import { createParamDecorator } from '@nestjs/common';

import { getSessionServiceMock } from '../../.mocks';
import { checkSession, extractSessionFromContext } from '../helper';
import { Session } from './session.decorator';

jest.mock('@nestjs/common', () => ({
  ...(jest.requireActual('@nestjs/common') as any),
  createParamDecorator: jest.fn(),
}));
jest.mock('@fc/common');
jest.mock('../helper');

describe('@Session()', () => {
  class DtoMock {}
  const ctxMock = {};
  const moduleNameMock = 'moduleNameMockValue';
  const argMock = '';
  const sessionDataMock = {};
  const sessionServiceMock = getSessionServiceMock();

  const createParamDecoratorMock = jest.mocked(createParamDecorator);
  const extractSessionFromContextMock = jest.mocked(extractSessionFromContext);
  const checkSessionMock = jest.mocked(checkSession);

  beforeEach(() => {
    jest.resetAllMocks();

    createParamDecoratorMock.mockImplementation((arg: any) => () => arg);
    extractSessionFromContextMock.mockImplementation(() => sessionServiceMock);

    sessionServiceMock.get.mockResolvedValue(sessionDataMock);
  });

  describe('Session() > decorator', () => {
    it('should get sessionService from context', async () => {
      // Given
      const decorator = Session(moduleNameMock) as Function;

      // When
      await decorator(argMock, ctxMock);

      // Then
      expect(extractSessionFromContextMock).toHaveBeenCalledTimes(1);

      expect(extractSessionFromContextMock).toHaveBeenCalledWith(
        moduleNameMock,
        ctxMock,
      );
    });

    it('should get session data if DTO is provided', async () => {
      // Given
      const decorator = Session(moduleNameMock, DtoMock) as Function;

      // When
      await decorator(argMock, ctxMock);

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call checkSession if DTO is provided', async () => {
      // Given
      const decorator = Session(moduleNameMock, DtoMock) as Function;

      // When
      await decorator(argMock, ctxMock);

      // Then
      expect(checkSessionMock).toHaveBeenCalledTimes(1);
      expect(checkSessionMock).toHaveBeenCalledWith(
        sessionDataMock,
        moduleNameMock,
        DtoMock,
      );
    });

    it('should not get session data if DTO is not provided', async () => {
      // Given
      const decorator = Session(moduleNameMock) as Function;

      // When
      await decorator(argMock, ctxMock);

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(0);
    });

    it('should not call checkSession if DTO is not provided', async () => {
      // Given
      const decorator = Session(moduleNameMock) as Function;

      // When
      await decorator(argMock, ctxMock);

      // Then
      expect(checkSessionMock).toHaveBeenCalledTimes(0);
    });

    it('should return sessionService from extractSessionFromContext', async () => {
      // Given
      const decorator = Session(moduleNameMock) as Function;

      // When
      const result = await decorator(argMock, ctxMock);

      // Then
      expect(result).toBe(sessionServiceMock);
    });
  });

  describe('Session()', () => {
    it('should call createParamDecorator()', () => {
      // When
      Session(moduleNameMock);

      // Then
      expect(createParamDecoratorMock).toHaveBeenCalledTimes(1);
    });

    it('should return result of the factory created by createParamDecorator()', () => {
      // Given
      const createParamDecoratorMockedResult = Symbol(
        'createParamDecoratorMockedResult',
      );
      createParamDecoratorMock.mockReturnValueOnce(
        () => createParamDecoratorMockedResult as any,
      );

      // When
      const result = Session(moduleNameMock);

      // Then
      expect(result).toBe(createParamDecoratorMockedResult);
    });
  });
});

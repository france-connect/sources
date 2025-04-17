import { createParamDecorator } from '@nestjs/common';

import { NestJsDependencyInjectionWrapper } from '@fc/common';

import { getSessionServiceMock } from '../../.mocks';
import { checkSession } from '../helper';
import { ISessionService } from '../interfaces';
import { SessionService } from '../services';
import { Session } from './session.decorator';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  createParamDecorator: jest.fn(),
}));

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  NestJsDependencyInjectionWrapper: { get: jest.fn() },
}));

jest.mock('../helper');

describe('@Session()', () => {
  class DtoMock {}
  const moduleNameMock = 'moduleNameMockValue';
  const sessionDataMock = {};
  const sessionServiceMock = getSessionServiceMock();
  const diWrapperMock = jest.mocked(NestJsDependencyInjectionWrapper);

  const createParamDecoratorMock = jest.mocked(createParamDecorator);
  const checkSessionMock = jest.mocked(checkSession);
  const returnDecoratorImplementation = (decorator) => () => decorator;

  beforeEach(() => {
    jest.resetAllMocks();

    /**
     * @DISCLAIMER
     * Force returning the decorator that would otherwise be inaccessible.
     * This will cause the returned function to be async when it should not be.
     */
    createParamDecoratorMock.mockImplementation(returnDecoratorImplementation);

    sessionServiceMock.get.mockReturnValue(sessionDataMock);
    diWrapperMock.get = jest.fn().mockReturnValue(sessionServiceMock);
  });

  describe('Session() > decorator', () => {
    it('should get sessionService from NestJsDependencyInjectionWrapper', async () => {
      // Given
      // See @DISCLAIMER above
      const decorator = Session(moduleNameMock) as unknown as () => Promise<
        ISessionService<unknown>
      >;

      // When
      await decorator();

      // Then
      expect(diWrapperMock.get).toHaveBeenCalledTimes(1);
      expect(diWrapperMock.get).toHaveBeenCalledWith(SessionService);
    });

    it('should get session data if DTO is provided', async () => {
      // Given
      // See @DISCLAIMER above
      const decorator = Session(
        moduleNameMock,
        DtoMock,
      ) as unknown as () => Promise<ISessionService<unknown>>;

      // When
      await decorator();

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call checkSession if DTO is provided', async () => {
      // Given
      // See @DISCLAIMER above
      const decorator = Session(
        moduleNameMock,
        DtoMock,
      ) as unknown as () => Promise<ISessionService<unknown>>;

      // When
      await decorator();

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
      // See @DISCLAIMER above
      const decorator = Session(moduleNameMock) as unknown as () => Promise<
        ISessionService<unknown>
      >;

      // When
      await decorator();

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(0);
    });

    it('should not call checkSession if DTO is not provided', async () => {
      // Given
      // See @DISCLAIMER above
      const decorator = Session(moduleNameMock) as unknown as () => Promise<
        ISessionService<unknown>
      >;

      // When
      await decorator();

      // Then
      expect(checkSessionMock).toHaveBeenCalledTimes(0);
    });

    it('should return sessionService from extractSessionFromContext', async () => {
      // Given
      // See @DISCLAIMER above
      const decorator = Session(moduleNameMock) as unknown as () => Promise<
        ISessionService<unknown>
      >;

      const boundFunctionMock = Symbol('boundFunctionMock');
      const bindMock = jest.fn().mockReturnValue(boundFunctionMock);

      sessionServiceMock.get.bind = bindMock;
      sessionServiceMock.set.bind = bindMock;
      sessionServiceMock.setAlias.bind = bindMock;
      sessionServiceMock.commit.bind = bindMock;

      // When
      const result = await decorator();

      // Then
      expect(result).toEqual({
        get: boundFunctionMock,
        set: boundFunctionMock,
        setAlias: boundFunctionMock,
        commit: boundFunctionMock,
      });
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
      ) as unknown as () => unknown;
      createParamDecoratorMock.mockReturnValueOnce(
        () => createParamDecoratorMockedResult,
      );

      // When
      const result = Session(moduleNameMock);

      // Then
      expect(result).toBe(createParamDecoratorMockedResult);
    });
  });
});

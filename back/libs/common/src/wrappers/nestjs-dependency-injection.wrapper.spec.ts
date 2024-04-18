import { useContainer } from 'class-validator';

import { INestApplicationContext } from '@nestjs/common';

import { NestJsDependencyInjectionWrapper } from './nestjs-dependency-injection.wrapper';

jest.mock('class-validator');

describe('NestjsDependencyInjectionWrapper', () => {
  const containerMock = {
    get: jest.fn(),
  };

  const useContainerMock = jest.mocked(useContainer);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('use()', () => {
    it('should set the NestJS dependency injection container', () => {
      // When
      NestJsDependencyInjectionWrapper.use(
        containerMock as unknown as INestApplicationContext,
      );

      // Then
      expect(NestJsDependencyInjectionWrapper.container).toBe(containerMock);
    });

    it('should initiate class validator', () => {
      // Given
      const spy = jest.spyOn(
        NestJsDependencyInjectionWrapper,
        'initiateClassValidator',
      );

      // When
      NestJsDependencyInjectionWrapper.use(
        containerMock as unknown as INestApplicationContext,
      );

      // Then
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(containerMock);
    });
  });

  describe('get()', () => {
    // Given
    const typeOrToken = 'typeOrToken';
    const nestDependencyMock = Symbol('Expected');

    beforeEach(() => {
      containerMock.get.mockReturnValue(nestDependencyMock);
    });

    it('should call container with default strict option', () => {
      // When
      NestJsDependencyInjectionWrapper.get(typeOrToken);

      // Then
      expect(containerMock.get).toHaveBeenCalledTimes(1);
      expect(containerMock.get).toHaveBeenCalledWith(typeOrToken, {
        strict: false,
      });
    });

    it('should call container with strict option', () => {
      // When
      NestJsDependencyInjectionWrapper.get(typeOrToken, true);

      // Then
      expect(containerMock.get).toHaveBeenCalledTimes(1);
      expect(containerMock.get).toHaveBeenCalledWith(typeOrToken, {
        strict: true,
      });
    });

    it('should return call to container.get()', () => {
      // When
      const result = NestJsDependencyInjectionWrapper.get(typeOrToken);

      // Then
      expect(result).toBe(nestDependencyMock);
    });
  });

  describe('initiateClassValidator()', () => {
    it('should call useContainer with container and fallbackOnErrors', () => {
      // When
      NestJsDependencyInjectionWrapper.initiateClassValidator(
        containerMock as unknown as INestApplicationContext,
      );

      // Then
      expect(useContainerMock).toHaveBeenCalledTimes(1);
      expect(useContainerMock).toHaveBeenCalledWith(containerMock, {
        fallbackOnErrors: true,
      });
    });
  });
});

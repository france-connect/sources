import { Response } from 'express';

import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { Instantiable } from '@fc/common';

import { TemplateMethod } from '../decorators';
import { ViewTemplateServiceNotFoundException } from '../exceptions/view-template-service-not-found.exception';
import { InternalMappingInterface } from '../interfaces';
import { HELPERS_PREFIX } from '../tokens';
import { ViewTemplateService } from './view-template.service';

jest.mock('../decorators');

describe('ViewTemplateService', () => {
  let service: ViewTemplateService;

  const moduleRefMock = {
    get: jest.fn(),
  };

  const TemplateMethodGetListMock = jest.mocked(TemplateMethod);
  TemplateMethodGetListMock.getList = jest.fn();

  const helperListMock = [
    {
      alias: 'aliasOne',
      provider: {},
      methodName: 'methodOne',
    },
    {
      alias: 'aliasTwo',
      provider: {},
      methodName: 'methodTwo',
    },
  ] as unknown as InternalMappingInterface[];

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewTemplateService],
    })
      .overrideProvider(ModuleRef)
      .useValue(moduleRefMock)
      .compile();

    service = module.get<ViewTemplateService>(ViewTemplateService);

    moduleRefMock.get.mockReturnValueOnce(undefined);
    TemplateMethodGetListMock.getList.mockReturnValueOnce(helperListMock);
  });

  it('should be defined', () => {
    // Then
    expect(service).toBeDefined();
  });

  describe('bindMethodsToResponse()', () => {
    let resMock = { locals: {} };

    const helper1 = Symbol('helper1');
    const helper2 = Symbol('helper2');

    beforeEach(() => {
      resMock = { locals: { randomKey: 'to witness initialisation' } };
      service['getHelper'] = jest
        .fn()
        .mockReturnValueOnce(helper1)
        .mockReturnValueOnce(helper2);
      service['exposeHelper'] = jest.fn();
    });

    it('should initialise res.locals[HELPERS_NAMESPACE] to empty object', () => {
      // When
      service.bindMethodsToResponse(resMock as Response);

      // Then
      expect(resMock.locals).toStrictEqual({
        randomKey: 'to witness initialisation',
      });
    });

    it('should call TemplateMethod.getList()', () => {
      // When
      service.bindMethodsToResponse(resMock as Response);

      // Then
      expect(TemplateMethodGetListMock.getList).toHaveBeenCalledTimes(1);
    });

    it('should call getHelper() for each method', () => {
      // When
      service.bindMethodsToResponse(resMock as Response);

      // Then
      expect(service['getHelper']).toHaveBeenCalledTimes(2);
      expect(service['getHelper']).toHaveBeenNthCalledWith(
        1,
        helperListMock[0].provider,
        helperListMock[0].methodName,
      );
      expect(service['getHelper']).toHaveBeenNthCalledWith(
        2,
        helperListMock[1].provider,
        helperListMock[1].methodName,
      );
    });

    it('should call exposeHelper() for each method', () => {
      // When
      service.bindMethodsToResponse(resMock as Response);

      // Then
      expect(service['exposeHelper']).toHaveBeenCalledTimes(2);
      expect(service['exposeHelper']).toHaveBeenNthCalledWith(
        1,
        resMock.locals,
        helperListMock[0].alias,
        helper1,
      );
      expect(service['exposeHelper']).toHaveBeenNthCalledWith(
        2,
        resMock.locals,
        helperListMock[1].alias,
        helper2,
      );
    });
  });

  describe('exposeHelper()', () => {
    const alias = 'aliasMock';
    const prefixedAlias = `${HELPERS_PREFIX}${alias}`;

    it('should create an entry with alias for helper', () => {
      // Given
      const helperList = {};
      const boundHelperMock = Symbol('boundHelperMock') as unknown as Function;

      // When
      service['exposeHelper'](helperList, alias, boundHelperMock);

      // Then
      expect(helperList).toHaveProperty(prefixedAlias);
    });

    it('should not erase existing entry', () => {
      // Given
      const helperList = {
        existingEntry: () => {},
      };

      const boundHelperMock = Symbol('boundHelperMock') as unknown as Function;

      // When
      service['exposeHelper'](helperList, alias, boundHelperMock);

      // Then
      expect(helperList).toHaveProperty('existingEntry');
      expect(helperList).toHaveProperty(prefixedAlias);
    });

    it('should store a reference to given helper', () => {
      // Given
      const helperList = {};

      const boundHelperMock = Symbol('boundHelperMock') as unknown as Function;

      // When
      service['exposeHelper'](helperList, alias, boundHelperMock);

      // Then
      expect(helperList[prefixedAlias]).toBe(boundHelperMock);
    });
  });

  describe('getHelper()', () => {
    const getInstanceMethodResult = Symbol('getInstanceMethodResult');
    const getStaticMethodResult = Symbol('getStaticMethodResult');

    beforeEach(() => {
      service['getInstanceMethod'] = jest
        .fn()
        .mockReturnValue(getInstanceMethodResult);
      service['getStaticMethod'] = jest
        .fn()
        .mockReturnValue(getStaticMethodResult);
    });

    it('should return result of call to getStaticMethod() if provider is a class', () => {
      // Given
      class MockClass {
        static mockMethod() {}
      }

      // When
      const result = service['getHelper'](MockClass, 'mockMethod');

      // Then
      expect(result).toBe(getStaticMethodResult);
    });

    it('should return result of call to getInstanceMethod() if provider is an instance', () => {
      // Given
      class MockClass {
        mockMethod() {}
      }

      const instanceMock = new MockClass();

      // When
      const result = service['getHelper'](
        instanceMock as unknown as Instantiable,
        'mockMethod',
      );

      // Then
      expect(result).toBe(getInstanceMethodResult);
    });
  });

  describe('getInstanceMethod()', () => {
    // Given
    class ProviderMock {
      foo() {}
    }
    const providerMock = new ProviderMock();
    const methodNameMock = 'foo';
    const boundInstanceMethod = Symbol('boundInstanceMethod');

    beforeEach(() => {
      const serviceMock = {
        [methodNameMock]: {
          bind: jest.fn().mockReturnValueOnce(boundInstanceMethod),
        },
      };
      moduleRefMock.get.mockReset().mockReturnValueOnce(serviceMock);
    });

    it('should call moduleRef.get() with given provider', () => {
      // When
      service['getInstanceMethod'](
        providerMock as unknown as Instantiable,
        methodNameMock,
      );

      // Then
      expect(moduleRefMock.get).toHaveBeenCalledTimes(1);
      expect(moduleRefMock.get).toHaveBeenCalledWith(providerMock.constructor, {
        strict: false,
      });
    });

    it('should return bound module reference for given provider', () => {
      // When
      const result = service['getInstanceMethod'](
        providerMock as unknown as Instantiable,
        methodNameMock,
      );

      // Then
      expect(result).toBe(boundInstanceMethod);
    });

    it('should throw specific exceptions if moduleRef.get() throws', () => {
      // Given
      moduleRefMock.get.mockReset().mockImplementationOnce(() => {
        throw new Error();
      });

      // Then / When
      expect(() =>
        service['getInstanceMethod'](
          providerMock as unknown as Instantiable,
          methodNameMock,
        ),
      ).toThrow(ViewTemplateServiceNotFoundException);
    });
  });

  describe('getStaticMethod()', () => {
    it('should return reference to property', () => {
      // Given
      class ProviderMock {
        static foo() {}
      }
      const methodNameMock = 'foo';

      // When
      const result = service['getStaticMethod'](ProviderMock, methodNameMock);

      // Then
      expect(result).toBe(ProviderMock.foo);
    });
  });
});

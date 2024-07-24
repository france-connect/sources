import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LogLevels } from '@fc/logger';

import { getConfigMock } from '@mocks/config';

import { LoggerDebugService } from './logger-debug.service';

describe('LoggerDebugService', () => {
  let service: LoggerDebugService;

  const stack =
    'Error: \n    at _dispatchDescribe (/some/path/jest-circus/build/index.js:91:26)\n \n \n \n \n at describe (/some/path/jest-circus/build/index.js:55:5)\n    at Runtime._execModule (/some/path/jest-runtime/build/index.js:1439:24)\n    at runTest (/some/path/jest-runner/build/runTest.js:444:34)\n    at Object.worker (/some/path/jest-runner/build/testWorker.js:106:12)';
  const formattedStack = [
    'Runtime._execModule (/some/path/jest-runtime/build/index.js:1439:24)',
    'runTest (/some/path/jest-runner/build/runTest.js:444:34)',
    'Object.worker (/some/path/jest-runner/build/testWorker.js:106:12)',
  ];

  const configServiceMock = getConfigMock();
  const configMok = {
    threshold: LogLevels.DEBUG,
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerDebugService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<LoggerDebugService>(LoggerDebugService);
    configServiceMock.get.mockReturnValue(configMok);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getContext', () => {
    const callStack = 'callStack mock value';
    const formattedCallStack = Symbol('formattedCallStack');
    const formattedMethodName = Symbol('formatMethodNameReturnValue');

    const errorMock = {
      stack: callStack,
    };
    const originalError = global.Error;

    afterAll(() => {
      global.Error = originalError;
    });

    beforeEach(() => {
      service['formatStack'] = jest.fn().mockReturnValue(formattedCallStack);
      service['formatMethodName'] = jest
        .fn()
        .mockReturnValue(formattedMethodName);

      global.Error = jest
        .fn()
        .mockImplementation(() => errorMock) as unknown as typeof Error;
    });

    it('should return empty object if threshold is not DEBUG', () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({ threshold: LogLevels.INFO });

      // When
      const result = service.getContext();

      // Then
      expect(result).toEqual({});
    });

    it('should call formatStack with given callStack', () => {
      // When
      service.getContext();

      // Then
      expect(service['formatStack']).toHaveBeenCalledWith(errorMock.stack);
    });

    it('should call formatMethodName with formattedStack', () => {
      // When
      service.getContext();

      // Then
      expect(service['formatMethodName']).toHaveBeenCalledWith(
        formattedCallStack,
      );
    });

    it('should return callStack and methodName', () => {
      // When
      const result = service.getContext();

      // Then
      expect(result).toEqual({
        callStack: formattedCallStack,
        methodName: formattedMethodName,
      });
    });
  });

  describe('formatStack', () => {
    it('should return formatted stack', () => {
      // When
      const result = service['formatStack'](stack);

      // Then
      expect(result).toEqual(formattedStack);
    });
  });

  describe('formatMethodName', () => {
    it('should return formatted method name', () => {
      // When
      const result = service['formatMethodName'](formattedStack);

      // Then
      expect(result).toEqual('Runtime._execModule()');
    });
  });
});

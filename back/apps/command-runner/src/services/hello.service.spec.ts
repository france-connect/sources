import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { HelloService } from './hello.service';

describe('HelloService', () => {
  let service: HelloService;
  const loggerMock = getLoggerMock();

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [HelloService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<HelloService>(HelloService);
  });

  it('should be defined', () => {
    // When / Then
    expect(service).toBeDefined();
  });

  it('should log "Hello world!" when no name is provided', () => {
    // When
    service.sayHello();

    // Then
    expect(loggerMock.info).toHaveBeenCalledTimes(1);
    expect(loggerMock.info).toHaveBeenCalledWith('Hello world!');
  });

  it('logs "Hello <name>" when a name is provided', () => {
    // When
    service.sayHello('Alice');

    // Then
    expect(loggerMock.info).toHaveBeenCalledTimes(1);
    expect(loggerMock.info).toHaveBeenCalledWith('Hello Alice');
  });
});

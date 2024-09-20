import { Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { MockRnippController } from '../controllers';
import { ScenarioQueryDto } from '../dto';
import { ExceptionKey, RnippCode, Scenario } from '../enums';
import { SuccessfullResponseInterface } from '../interfaces';
import { MockRnippService } from '../services';

jest.mock('../services/mock-rnipp.service');

describe('MockRnippController', () => {
  let controller: MockRnippController;
  const loggerServiceMock = getLoggerMock();

  const resMock = {
    status: jest.fn(),
    redirect: jest.fn(),
    sendFile: jest.fn(),
    setHeader: jest.fn(),
    render: jest.fn(),
  } as unknown as Response;

  const nextMock = jest.fn();

  const MockRnippServiceMock = {
    getExceptionKey: jest.fn(),
    getRnippCode: jest.fn(),
    getScenario: jest.fn(),
    formatDate: jest.fn(),
    formatName: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockRnippController],
      providers: [MockRnippService, LoggerService],
    })
      .overrideProvider(MockRnippService)
      .useValue(MockRnippServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    controller = module.get<MockRnippController>(MockRnippController);
    jest.mocked(resMock.status).mockReturnValue(resMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('defaultController', () => {
    it('should redirect to /Brpp2IdentificationComplet/individus with status 303', () => {
      controller.defaultController(resMock);
      expect(resMock.status).toHaveBeenCalledWith(303);
      expect(resMock.redirect).toHaveBeenCalledWith(
        '/Brpp2IdentificationComplet/individus',
      );
    });
  });

  describe('healthCheck', () => {
    it('should return OK', () => {
      expect(controller.healthCheck()).toBe('OK');
    });
  });

  describe('handleScenario', () => {
    const successfullQuery = {
      codeLieuNaissance: '75020',
      prenoms: 'test',
      dateNaissance: '19950308',
    } as ScenarioQueryDto;

    const ejsContext = {
      ...successfullQuery,
      prenoms: ['test'],
      dateNaissance: '1995-03-08',
      status: RnippCode.TWO,
    } as SuccessfullResponseInterface;

    it('should call getSucessfullResponse', () => {
      controller['getSucessfullResponse'] = jest.fn();
      MockRnippServiceMock.getExceptionKey.mockReturnValue(undefined);
      MockRnippServiceMock.getRnippCode.mockReturnValue(RnippCode.TWO);
      MockRnippServiceMock.getScenario.mockReturnValue(Scenario.SUCCESS);

      // When
      controller.handleScenario(successfullQuery, resMock, nextMock);

      // Then
      expect(controller['getSucessfullResponse']).toHaveBeenCalledTimes(1);
      expect(controller['getSucessfullResponse']).toHaveBeenCalledWith(
        successfullQuery,
        RnippCode.TWO,
      );
    });

    it('should set response header', () => {
      // Given
      controller['getSucessfullResponse'] = jest
        .fn()
        .mockReturnValue(ejsContext);
      MockRnippServiceMock.getExceptionKey.mockReturnValue(undefined);
      MockRnippServiceMock.getRnippCode.mockReturnValue(RnippCode.TWO);
      MockRnippServiceMock.getScenario.mockReturnValue(Scenario.SUCCESS);

      // When
      controller.handleScenario(successfullQuery, resMock, nextMock);

      // Then
      expect(resMock.setHeader).toHaveBeenCalledTimes(1);
      expect(resMock.setHeader).toHaveBeenCalledWith(
        'content-type',
        'text/xml',
      );
    });

    it('should render view', () => {
      // Given
      controller['getSucessfullResponse'] = jest
        .fn()
        .mockReturnValue(ejsContext);
      MockRnippServiceMock.getExceptionKey.mockReturnValue(undefined);
      MockRnippServiceMock.getRnippCode.mockReturnValue(RnippCode.TWO);
      MockRnippServiceMock.getScenario.mockReturnValue(Scenario.SUCCESS);

      // When
      controller.handleScenario(successfullQuery, resMock, nextMock);

      // Then
      expect(resMock.render).toHaveBeenCalledTimes(1);
      expect(resMock.render).toHaveBeenCalledWith('OK', ejsContext);
    });

    it('should simulate timeout error', () => {
      // Given
      jest.useFakeTimers();
      const timeoutQuery = {
        codeLieuNaissance: '75020',
        prenoms: 'test_E010011',
        dateNaissance: '19950308',
      };
      MockRnippServiceMock.getExceptionKey.mockReturnValue(
        ExceptionKey.E010011,
      );
      MockRnippServiceMock.getRnippCode.mockReturnValue(undefined);
      MockRnippServiceMock.getScenario.mockReturnValue(Scenario.TIMEOUT);

      // When
      controller.handleScenario(timeoutQuery, resMock, nextMock);

      // Then
      jest.advanceTimersByTime(7000);
      expect(nextMock).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('should send error file', () => {
      // Given
      const errorQuery = {
        codeLieuNaissance: '75020',
        prenoms: 'test_E010004',
        dateNaissance: '19950308',
      };
      controller['handleSuccess'] = jest.fn();
      MockRnippServiceMock.getExceptionKey.mockReturnValue(
        ExceptionKey.E010004,
      );
      MockRnippServiceMock.getRnippCode.mockReturnValue(undefined);
      MockRnippServiceMock.getScenario.mockReturnValue(Scenario.ERROR);

      // When
      controller.handleScenario(errorQuery, resMock, nextMock);

      // Then
      expect(resMock.sendFile).toHaveBeenCalledTimes(1);
      expect(resMock.sendFile).toHaveBeenCalledWith('responses/E010004.xml', {
        root: expect.any(String),
      });
    });
  });

  describe('getSucessfullResponse', () => {
    beforeEach(() => {
      MockRnippServiceMock.formatDate.mockReturnValue('1995-03-08');
      MockRnippServiceMock.formatName.mockReturnValue(['test']);
    });

    const query = {
      codeLieuNaissance: '75020',
      prenoms: 'test',
      dateNaissance: '19950308',
    } as ScenarioQueryDto;

    it('should call formatDate', () => {
      // When
      controller['getSucessfullResponse'](query, RnippCode.TWO);

      // Then
      expect(MockRnippServiceMock.formatDate).toHaveBeenCalledTimes(1);
      expect(MockRnippServiceMock.formatDate).toHaveBeenCalledWith('19950308');
    });

    it('should call formatName', () => {
      // When
      controller['getSucessfullResponse'](query, RnippCode.TWO);

      // Then
      expect(MockRnippServiceMock.formatName).toHaveBeenCalledTimes(1);
      expect(MockRnippServiceMock.formatName).toHaveBeenCalledWith('test');
    });

    it('should return ejsContext', () => {
      // Given
      const ejsContext = {
        ...query,
        prenoms: ['test'],
        dateNaissance: '1995-03-08',
        status: RnippCode.TWO,
      } as SuccessfullResponseInterface;

      // When / Then
      expect(controller['getSucessfullResponse'](query, RnippCode.TWO)).toEqual(
        ejsContext,
      );
    });
  });
});

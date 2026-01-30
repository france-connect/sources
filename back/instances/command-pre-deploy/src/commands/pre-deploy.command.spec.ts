import { Test, TestingModule } from '@nestjs/testing';

import { EnvService } from '@fc/common';
import { LoggerService } from '@fc/logger';

import { getEnvServiceMock } from '@mocks/common';
import { getLoggerMock } from '@mocks/logger';

import { CommandPreDeployService } from '../services/command-pre-deploy.service';
import { PreDeployCommand } from './pre-deploy.command';

describe('PreDeployCommand', () => {
  const loggerMock = getLoggerMock();
  const envServiceMock = getEnvServiceMock();
  const commandPreDeployServiceMock = {
    run: jest.fn(),
  };

  let command: PreDeployCommand;
  let processExitSpy: jest.SpyInstance;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    processExitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreDeployCommand,
        LoggerService,
        CommandPreDeployService,
        EnvService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CommandPreDeployService)
      .useValue(commandPreDeployServiceMock)
      .overrideProvider(EnvService)
      .useValue(envServiceMock)
      .compile();

    command = module.get<PreDeployCommand>(PreDeployCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  describe('run', () => {
    beforeEach(() => {
      envServiceMock.get
        .mockReturnValueOnce('test-app')
        .mockReturnValueOnce('development');
    });

    it('should log the start of the command', async () => {
      // When
      await command.run([], {});

      // Then
      expect(loggerMock.notice).toHaveBeenCalledWith(
        'Command-pre-deploy started',
      );
    });

    it('should call commandPreDeployService.run with app and env', async () => {
      // When
      await command.run([], {});

      // Then
      expect(commandPreDeployServiceMock.run).toHaveBeenCalledWith(
        'test-app',
        'development',
      );
    });

    it('should log the end of the command on success', async () => {
      // When
      await command.run([], {});

      // Then
      expect(loggerMock.notice).toHaveBeenCalledWith(
        'Command-pre-deploy finished',
      );
    });

    it('should log error and exit with code 1 when service throws', async () => {
      // Given
      const error = new Error('Service failed');
      commandPreDeployServiceMock.run.mockRejectedValueOnce(error);

      // When
      await command.run([], {});

      // Then
      expect(loggerMock.alert).toHaveBeenCalledWith(
        {
          context: {
            app: 'test-app',
            env: 'development',
            reason: error.message,
            stack: error.stack,
          },
        },
        'Command-pre-deploy failed',
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should work with production environment', async () => {
      // Given
      jest.resetAllMocks();
      envServiceMock.get
        .mockReturnValueOnce('test-app')
        .mockReturnValueOnce('production');

      // When
      await command.run([], {});

      // Then
      expect(commandPreDeployServiceMock.run).toHaveBeenCalledWith(
        'test-app',
        'production',
      );
    });
  });

  describe('parseAndValidateArgs', () => {
    beforeEach(() => {
      command['validateApp'] = jest.fn();
      command['validateEnv'] = jest.fn();
    });

    it('should call envService.get twice with APP and NODE_ENV', () => {
      // Given
      envServiceMock.get
        .mockReturnValueOnce('my-app')
        .mockReturnValueOnce('development');

      // When
      command['parseAndValidateArgs']();

      // Then
      expect(envServiceMock.get).toHaveBeenCalledTimes(2);
      expect(envServiceMock.get).toHaveBeenNthCalledWith(1, 'APP');
      expect(envServiceMock.get).toHaveBeenNthCalledWith(2, 'NODE_ENV');
    });

    it('should call validateApp with app value', () => {
      // Given
      envServiceMock.get
        .mockReturnValueOnce('my-app')
        .mockReturnValueOnce('development');

      // When
      command['parseAndValidateArgs']();

      // Then
      expect(command['validateApp']).toHaveBeenCalledExactlyOnceWith('my-app');
    });

    it('should call validateEnv with env value', () => {
      // Given
      envServiceMock.get
        .mockReturnValueOnce('my-app')
        .mockReturnValueOnce('development');

      // When
      command['parseAndValidateArgs']();

      // Then
      expect(command['validateEnv']).toHaveBeenCalledExactlyOnceWith(
        'development',
      );
    });

    it('should return app and env from environment variables', () => {
      // Given
      envServiceMock.get
        .mockReturnValueOnce('my-app')
        .mockReturnValueOnce('development');

      // When
      const result = command['parseAndValidateArgs']();

      // Then
      expect(result).toEqual({ app: 'my-app', env: 'development' });
    });
  });

  describe('validateApp', () => {
    it('should exit with code 1 if APP is empty', () => {
      // When
      command['validateApp']('');

      // Then
      expect(loggerMock.crit).toHaveBeenCalledWith(
        'APP environment variable is required',
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should not exit if APP is provided', () => {
      // When
      command['validateApp']('valid-app');

      // Then
      expect(processExitSpy).not.toHaveBeenCalled();
    });
  });

  describe('validateEnv', () => {
    it('should exit with code 1 if NODE_ENV is not development or production', () => {
      // When
      command['validateEnv']('staging');

      // Then
      expect(loggerMock.crit).toHaveBeenCalledWith(
        { context: { env: 'staging' } },
        `NODE_ENV must be 'development' or 'production'`,
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should not exit if NODE_ENV is development', () => {
      // When
      command['validateEnv']('development');

      // Then
      expect(processExitSpy).not.toHaveBeenCalled();
    });

    it('should not exit if NODE_ENV is production', () => {
      // When
      command['validateEnv']('production');

      // Then
      expect(processExitSpy).not.toHaveBeenCalled();
    });

    it('should exit with code 1 if NODE_ENV is empty', () => {
      // When
      command['validateEnv']('');

      // Then
      expect(loggerMock.crit).toHaveBeenCalledWith(
        { context: { env: '' } },
        `NODE_ENV must be 'development' or 'production'`,
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });
});

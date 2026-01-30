import { existsSync } from 'fs';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { CommandPreDeployService } from './command-pre-deploy.service';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

describe('CommandPreDeployService', () => {
  const loggerMock = getLoggerMock();
  const configMock = getConfigMock();
  const existsSyncMock = jest.mocked(existsSync);

  let service: CommandPreDeployService;
  let execAsyncMock: jest.Mock;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    execAsyncMock = jest.fn();
    configMock.get.mockReturnValue({ basePath: '/var/www/app' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandPreDeployService, LoggerService, ConfigService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    service = module.get<CommandPreDeployService>(CommandPreDeployService);
    service['execAsync'] = execAsyncMock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize execAsync with promisify(exec)', () => {
      // Given
      service['execAsync'] = undefined;

      // When
      service.onModuleInit();

      // Then
      expect(service['execAsync']).toBeDefined();
      expect(typeof service['execAsync']).toBe('function');
    });
  });

  describe('run', () => {
    const app = 'test-app';
    const env = 'development';
    const expectedScriptPath = '/var/www/app/deploy/development/pre-deploy.sh';

    it('should log the start message', async () => {
      // Given
      existsSyncMock.mockReturnValue(false);

      // When
      await service.run(app, env);

      // Then
      expect(loggerMock.notice).toHaveBeenCalledWith(
        { context: { app, env } },
        'Pre-deploy started',
      );
    });

    it('should check if script exists at the correct path', async () => {
      // Given
      existsSyncMock.mockReturnValue(false);

      // When
      await service.run(app, env);

      // Then
      expect(existsSyncMock).toHaveBeenCalledWith(expectedScriptPath);
    });

    it('should log notice message when script does not exist', async () => {
      // Given
      existsSyncMock.mockReturnValue(false);

      // When
      await service.run(app, env);

      // Then
      expect(loggerMock.notice).toHaveBeenCalledWith(
        { context: { app, env, scriptPath: expectedScriptPath } },
        '✅ No pre-deploy actions needed',
      );
    });

    it('should not run script when script does not exist', async () => {
      // Given
      existsSyncMock.mockReturnValue(false);

      // When
      await service.run(app, env);

      // Then
      expect(execAsyncMock).not.toHaveBeenCalled();
    });

    it('should run script when script exists', async () => {
      // Given
      existsSyncMock.mockReturnValue(true);
      execAsyncMock.mockResolvedValue({ stdout: '', stderr: '' });

      // When
      await service.run(app, env);

      // Then
      expect(execAsyncMock).toHaveBeenCalledWith(
        `cd /var/www/app && bash "${expectedScriptPath}"`,
      );
    });

    it('should work with production environment', async () => {
      // Given
      const prodEnv = 'production';
      const prodScriptPath = '/var/www/app/deploy/production/pre-deploy.sh';
      existsSyncMock.mockReturnValue(true);
      execAsyncMock.mockResolvedValue({ stdout: '', stderr: '' });

      // When
      await service.run(app, prodEnv);

      // Then
      expect(existsSyncMock).toHaveBeenCalledWith(prodScriptPath);
      expect(execAsyncMock).toHaveBeenCalledWith(
        `cd /var/www/app && bash "${prodScriptPath}"`,
      );
    });
  });

  describe('runPreDeployScript', () => {
    const scriptPath = '/var/www/app/deploy/dev/pre-deploy.sh';
    const basePath = '/var/www/app';

    it('should log the script path being run', async () => {
      // Given
      execAsyncMock.mockResolvedValue({ stdout: '', stderr: '' });

      // When
      await service['runPreDeployScript'](scriptPath, basePath);

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith(
        { context: { scriptPath } },
        'Running pre-deploy script',
      );
    });

    it('should execute the script with bash from base path', async () => {
      // Given
      execAsyncMock.mockResolvedValue({ stdout: '', stderr: '' });

      // When
      await service['runPreDeployScript'](scriptPath, basePath);

      // Then
      expect(execAsyncMock).toHaveBeenCalledWith(
        `cd ${basePath} && bash "${scriptPath}"`,
      );
    });

    it('should log stdout when present', async () => {
      // Given
      const stdout = 'Script output';
      execAsyncMock.mockResolvedValue({ stdout, stderr: '' });

      // When
      await service['runPreDeployScript'](scriptPath, basePath);

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith(
        { context: { stdout } },
        'Pre-deploy script output',
      );
    });

    it('should not log stdout when empty', async () => {
      // Given
      execAsyncMock.mockResolvedValue({ stdout: '', stderr: '' });

      // When
      await service['runPreDeployScript'](scriptPath, basePath);

      // Then
      expect(loggerMock.info).not.toHaveBeenCalledWith(
        { context: { stdout: '' } },
        'Pre-deploy script output',
      );
    });

    it('should log stderr as warning when present', async () => {
      // Given
      const stderr = 'Warning message';
      execAsyncMock.mockResolvedValue({ stdout: '', stderr });

      // When
      await service['runPreDeployScript'](scriptPath, basePath);

      // Then
      expect(loggerMock.warning).toHaveBeenCalledWith(
        { context: { stderr } },
        'Pre-deploy script stderr output',
      );
    });

    it('should not log stderr when empty', async () => {
      // Given
      execAsyncMock.mockResolvedValue({ stdout: '', stderr: '' });

      // When
      await service['runPreDeployScript'](scriptPath, basePath);

      // Then
      expect(loggerMock.warning).not.toHaveBeenCalled();
    });

    it('should log success message on completion', async () => {
      // Given
      execAsyncMock.mockResolvedValue({ stdout: '', stderr: '' });

      // When
      await service['runPreDeployScript'](scriptPath, basePath);

      // Then
      expect(loggerMock.notice).toHaveBeenCalledWith(
        'Pre-deploy completed successfully',
      );
    });

    it('should log error and rethrow when script execution fails', async () => {
      // Given
      const error = new Error('Script execution failed');
      execAsyncMock.mockRejectedValue(error);

      // When / Then
      await expect(
        service['runPreDeployScript'](scriptPath, basePath),
      ).rejects.toThrow(error);

      expect(loggerMock.crit).toHaveBeenCalledWith(
        {
          context: {
            scriptPath,
            reason: error.message,
            stack: error.stack,
          },
        },
        'Failed to run pre-deploy script',
      );
    });
  });
});

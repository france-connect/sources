import { existsSync } from 'fs';

import { exec } from 'child_process';
import { promisify } from 'util';

import { Injectable, OnModuleInit } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { AppCliConfig } from '../dto';

@Injectable()
export class CommandPreDeployService implements OnModuleInit {
  private execAsync;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    this.execAsync = promisify(exec);
  }

  async run(app: string, env: string): Promise<void> {
    this.logger.notice({ context: { app, env } }, 'Pre-deploy started');

    const { basePath } = this.config.get<AppCliConfig>('App');
    const scriptPath = `${basePath}/deploy/${env}/pre-deploy.sh`;

    if (!existsSync(scriptPath)) {
      this.logger.notice(
        { context: { app, env, scriptPath } },
        '✅ No pre-deploy actions needed',
      );
      return;
    }

    await this.runPreDeployScript(scriptPath, basePath);
  }

  private async runPreDeployScript(
    scriptPath: string,
    basePath: string,
  ): Promise<void> {
    this.logger.info({ context: { scriptPath } }, 'Running pre-deploy script');

    try {
      // Execute the script from base path to ensure relative paths work correctly
      const { stdout, stderr } = await this.execAsync(
        `cd ${basePath} && bash "${scriptPath}"`,
      );

      if (stdout) {
        this.logger.info({ context: { stdout } }, 'Pre-deploy script output');
      }

      if (stderr) {
        this.logger.warning(
          { context: { stderr } },
          'Pre-deploy script stderr output',
        );
      }

      this.logger.notice('Pre-deploy completed successfully');
    } catch (error) {
      this.logger.crit(
        { context: { scriptPath, reason: error.message, stack: error.stack } },
        'Failed to run pre-deploy script',
      );
      throw error;
    }
  }
}

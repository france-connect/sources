import { Command, CommandRunner } from 'nest-commander';

import { EnvService } from '@fc/common';
import { LoggerService } from '@fc/logger';

import { CommandPreDeployService } from '../services';

@Command({
  name: 'command-pre-deploy',
  description:
    'Execute pre-deployment scripts for a specific application and environment',
})
export class PreDeployCommand extends CommandRunner {
  constructor(
    private readonly logger: LoggerService,
    private readonly commandPreDeployService: CommandPreDeployService,
    private readonly envService: EnvService,
  ) {
    super();
  }

  async run(
    _passedParams: string[],
    _options?: Record<string, unknown>,
  ): Promise<void> {
    this.logger.notice('Command-pre-deploy started');

    const { app, env } = this.parseAndValidateArgs();

    try {
      await this.commandPreDeployService.run(app, env);
    } catch (error) {
      this.logger.alert(
        {
          context: {
            app,
            env,
            reason: error.message,
            stack: error.stack,
          },
        },
        'Command-pre-deploy failed',
      );
      process.exit(1);
    }

    this.logger.notice('Command-pre-deploy finished');
  }

  private parseAndValidateArgs(): { app: string; env: string } {
    const app = this.envService.get('APP');
    const env = this.envService.get('NODE_ENV');

    this.validateApp(app);
    this.validateEnv(env);

    return { app, env };
  }

  private validateApp(app: string): void {
    if (!app) {
      this.logger.crit('APP environment variable is required');
      process.exit(1);
    }
  }

  private validateEnv(env: string): void {
    if (env !== 'development' && env !== 'production') {
      this.logger.crit(
        { context: { env } },
        `NODE_ENV must be 'development' or 'production'`,
      );
      process.exit(1);
    }
  }
}

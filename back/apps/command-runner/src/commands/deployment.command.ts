import { Command, CommandRunner, Option } from 'nest-commander';

import { LoggerService } from '@fc/logger';

import { DeploymentCommandOptionsInterface } from '../interfaces';
import { HelloService } from '../services';

@Command({
  name: 'deployment',
  description: 'Appelle la méthode sayHello du HelloService avec le flag name',
})
export class DeploymentCommand extends CommandRunner {
  constructor(
    private readonly logger: LoggerService,
    private readonly hello: HelloService,
  ) {
    super();
  }

  async run(
    passedParam: string[],
    options?: DeploymentCommandOptionsInterface,
  ): Promise<void> {
    this.logger.info('--- Début de la DeploymentCommand ---');
    this.logger.info(
      `Arguments reçus: ${passedParam.length ? passedParam.join(' ') : 'aucun'}`,
    );

    this.hello.sayHello(options?.name);
    await Promise.resolve();

    this.logger.info('--- Fin de DeploymentCommand ---');
  }

  // Option decorator enables to parse command flags (cf doc: https://nest-commander.jaymcdoniel.dev/en/features/commander/)
  @Option({
    flags: '-n, --name [string]',
    description: 'Name flag',
  })
  parseName(val: string): string {
    return val;
  }
}

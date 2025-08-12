import { Module } from '@nestjs/common';

import { HttpProxyModule } from '@fc/http-proxy';

import { DeploymentCommand } from './commands';
import { HelloService } from './services';

@Module({
  imports: [HttpProxyModule],
  providers: [DeploymentCommand, HelloService],
})
export class CommandRunnerModule {}

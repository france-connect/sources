import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import {
  LoggerConfig,
  LoggerPluginServiceInterface,
  LogLevels,
} from '@fc/logger';

/**
 * Numbers of entries in stack traces that we want to skip
 * because they represent the call to logger and this plugin.
 *
 * @note This plugin is only active on dev environment
 * where the stack trace limit is specifically increased for this purpose
 * with: `NODE_OPTIONS=--stack-trace-limit=30`
 *
 * @see https://nodejs.org/docs/latest-v18.x/api/cli.html#cli_node_options_options
 */
const TRACE_LOGGER_STEPS = 7;

@Injectable()
export class LoggerDebugService implements LoggerPluginServiceInterface {
  constructor(private readonly config: ConfigService) {}

  getContext(): Record<string, unknown> {
    const { threshold } = this.config.get<LoggerConfig>('Logger');

    if (threshold !== LogLevels.DEBUG) {
      return {};
    }

    const callStack = new Error().stack;

    const formattedStack = this.formatStack(callStack);
    const methodName = this.formatMethodName(formattedStack);

    return {
      callStack: formattedStack,
      methodName,
    };
  }

  private formatStack(stack: string): string[] {
    return stack
      .split('\n')
      .slice(TRACE_LOGGER_STEPS)
      .map((line) => line.replace('at ', '').trim());
  }

  private formatMethodName(formattedStack: string[]): string {
    return formattedStack[0].split(' ')[0] + '()';
  }
}

import pino, { Logger } from 'pino';

import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { LoggerConfig } from '../dto';
import { LogLevels } from '../enums';
import { LoggerPluginServiceInterface } from '../interfaces';
import { PLUGIN_SERVICES } from '../tokens';
import { CustomLogLevels } from '../types';

@Injectable()
export class LoggerService {
  private readonly customLevels = {
    [LogLevels.BUSINESS]: 100,
    [LogLevels.EMERGENCY]: 80,
    [LogLevels.ALERT]: 70,
    [LogLevels.CRITICAL]: 60,
    [LogLevels.ERROR]: 50,
    [LogLevels.WARNING]: 40,
    [LogLevels.NOTICE]: 30,
    [LogLevels.INFO]: 20,
    [LogLevels.DEBUG]: 10,
  };
  private pino: Logger<keyof CustomLogLevels>;

  constructor(
    private readonly config: ConfigService,
    @Inject(PLUGIN_SERVICES)
    private readonly plugins: LoggerPluginServiceInterface[],
  ) {
    this.configure();
  }

  /**
   * Below are the methods to wrap the pino logger levels functions.
   */

  [LogLevels.BUSINESS](msg: string, ...args: unknown[]);
  [LogLevels.BUSINESS](obj: unknown, msg?: string, ...args: unknown[]);
  [LogLevels.BUSINESS](obj: unknown, msg?: string, ...args: unknown[]): void {
    this.logWithContext(LogLevels.BUSINESS, obj, msg, ...args);
  }

  [LogLevels.EMERGENCY](msg: string, ...args: unknown[]);
  [LogLevels.EMERGENCY](obj: unknown, msg?: string, ...args: unknown[]);
  [LogLevels.EMERGENCY](obj: unknown, msg?: string, ...args: unknown[]): void {
    this.logWithContext(LogLevels.EMERGENCY, obj, msg, ...args);
  }

  [LogLevels.ALERT](msg: string, ...args: unknown[]);
  [LogLevels.ALERT](obj: unknown, msg?: string, ...args: unknown[]);
  [LogLevels.ALERT](obj: unknown, msg?: string, ...args: unknown[]): void {
    this.logWithContext(LogLevels.ALERT, obj, msg, ...args);
  }

  [LogLevels.CRITICAL](msg: string, ...args: unknown[]);
  [LogLevels.CRITICAL](obj: unknown, msg?: string, ...args: unknown[]);
  [LogLevels.CRITICAL](obj: unknown, msg?: string, ...args: unknown[]): void {
    this.logWithContext(LogLevels.CRITICAL, obj, msg, ...args);
  }

  [LogLevels.ERROR](msg: string, ...args: unknown[]);
  [LogLevels.ERROR](obj: unknown, msg?: string, ...args: unknown[]);
  [LogLevels.ERROR](obj: unknown, msg?: string, ...args: unknown[]): void {
    this.logWithContext(LogLevels.ERROR, obj, msg, ...args);
  }

  [LogLevels.WARNING](msg: string, ...args: unknown[]);
  [LogLevels.WARNING](obj: unknown, msg?: string, ...args: unknown[]);
  [LogLevels.WARNING](obj: unknown, msg?: string, ...args: unknown[]): void {
    this.logWithContext(LogLevels.WARNING, obj, msg, ...args);
  }

  [LogLevels.NOTICE](msg: string, ...args: unknown[]);
  [LogLevels.NOTICE](obj: unknown, msg?: string, ...args: unknown[]);
  [LogLevels.NOTICE](obj: unknown, msg?: string, ...args: unknown[]): void {
    this.logWithContext(LogLevels.NOTICE, obj, msg, ...args);
  }

  [LogLevels.INFO](msg: string, ...args: unknown[]);
  [LogLevels.INFO](obj: unknown, msg?: string, ...args: unknown[]);
  [LogLevels.INFO](obj: unknown, msg?: string, ...args: unknown[]): void {
    this.logWithContext(LogLevels.INFO, obj, msg, ...args);
  }

  [LogLevels.DEBUG](msg: string, ...args: unknown[]);
  [LogLevels.DEBUG](obj: unknown, msg?: string, ...args: unknown[]);
  [LogLevels.DEBUG](obj: unknown, msg?: string, ...args: unknown[]): void {
    this.logWithContext(LogLevels.DEBUG, obj, msg, ...args);
  }

  private logWithContext(level: LogLevels, ...args: unknown[]): void {
    const pluginsContext = this.getContextFromPlugins();
    const userContext = typeof args[0] === 'string' ? {} : args.shift();
    const finalContext = Object.assign({}, userContext, pluginsContext);

    this.pino[level](finalContext, ...(args as [string?, ...unknown[]]));
  }

  private getContextFromPlugins(): Record<string, unknown> {
    const context = {};

    this.plugins.forEach((plugin) => {
      if (typeof plugin.getContext === 'function') {
        Object.assign(context, plugin.getContext());
      }
    });

    return context;
  }

  private configure() {
    const { threshold } = this.config.get<LoggerConfig>('Logger');
    const customLevels = this.customLevels;

    const options = {
      level: threshold,
      customLevels,
      useOnlyCustomLevels: true,
    };

    this.pino = pino(options);

    this.overloadConsole();
    this.pino.notice('Logger is ready and native console is now overloaded.');
  }

  private overloadConsole() {
    console.log = this[LogLevels.INFO].bind(this);
    console.info = this[LogLevels.NOTICE].bind(this);
    console.warn = this[LogLevels.WARNING].bind(this);
    console.error = this[LogLevels.CRITICAL].bind(this);
    console.debug = this[LogLevels.DEBUG].bind(this);
    console.trace = this[LogLevels.DEBUG].bind(this);
  }
}

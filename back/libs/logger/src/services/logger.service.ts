import pino, { DestinationStream, Logger, StreamEntry } from 'pino';

import { Injectable } from '@nestjs/common';

import {
  AsyncLocalStorageRequestInterface,
  AsyncLocalStorageService,
} from '@fc/async-local-storage';
import { ConfigService } from '@fc/config';
import { SessionStoreInterface } from '@fc/session/interfaces';
import { SESSION_STORE_KEY } from '@fc/session/tokens';

import { LoggerConfig } from '../dto';
import { LogLevels } from '../enums';
import { LogContextInterface } from '../interfaces';
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
    private readonly asyncLocalStorage: AsyncLocalStorageService<
      AsyncLocalStorageRequestInterface & SessionStoreInterface
    >,
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
    const requestContext = this.getRequestContext();
    const userContext = typeof args[0] === 'string' ? {} : args.shift();
    const finalContext = Object.assign({}, userContext, requestContext);

    this.pino[level](finalContext, ...(args as [string?, ...unknown[]]));
  }

  private getRequestContext(): LogContextInterface | undefined {
    const req = this.asyncLocalStorage.get('request');
    const sessionStore = this.asyncLocalStorage.get(SESSION_STORE_KEY);

    if (!req) {
      return;
    }

    const sessionId = sessionStore?.id;

    const { headers, method, baseUrl, path } = req;
    const context: Partial<LogContextInterface> = {
      method,
      path: `${baseUrl}${path}`,
      sessionId,
    };

    if (headers['x-request-id']) {
      // We do not expect an array from the RP
      context.requestId = headers['x-request-id'] as string;
    }

    if (headers['x-suspicious']) {
      context.isSuspicious = headers['x-suspicious'] === '1';
    }

    return context as LogContextInterface;
  }

  private configure() {
    const { threshold } = this.config.get<LoggerConfig>('Logger');
    const customLevels = this.customLevels;

    const options = {
      level: threshold,
      customLevels,
      useOnlyCustomLevels: true,
    };
    const streams = this.buildStreams();

    this.pino = pino(options, streams);

    this.overloadConsole();
    this.pino.notice('Logger is ready and native console is now overloaded.');
  }

  private buildTransportFdTargets(
    levels: LogLevels[],
    { fd: destination }: NodeJS.WriteStream & { fd: number },
  ) {
    const targets = [];

    levels.forEach((level: string) => {
      targets.push({
        target: 'pino/file',
        level,
        options: {
          destination,
        },
      });
    });

    return targets;
  }

  private buildStreams(): DestinationStream {
    const { wsMultiplexer, stdoutLevels, stderrLevels } =
      this.config.get<LoggerConfig>('Logger');

    const targets = [
      ...this.buildTransportFdTargets(stdoutLevels, process.stdout),
      ...this.buildTransportFdTargets(stderrLevels, process.stderr),
    ];

    const stdTransport = pino.transport({
      targets,
      levels: this.customLevels,
      dedupe: true,
    });

    const streams: StreamEntry[] = [
      {
        stream: stdTransport,
        level: LogLevels.DEBUG,
      },
    ];

    if (wsMultiplexer) {
      throw new Error('Websocket transport is not implemented yet.');
    }

    /**
     * Multistream needs to be aware of our custom levels so it must be passed here as well.
     */
    return pino.multistream(streams, {
      levels: this.customLevels,
    });
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

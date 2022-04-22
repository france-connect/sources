import * as os from 'os';
import * as pino from 'pino';
import * as QuickLRU from 'quick-lru';
import { v4 as uuidV4 } from 'uuid';

import { ConsoleLogger, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import * as colors from './constants';
import { LoggerConfig } from './dto';
import { LoggerLevelNames } from './enum';
import { ILoggerBusinessEvent, ILoggerColorParams } from './interfaces';
import { nestLevelsMap, pinoLevelsMap } from './log-maps.map';
import * as utils from './utils';

/**
 * /!\ CAN BE CHANGED MANUALLY /!\
 * This variable allows the developper to display the logs
 * either in Chrome or only in Terminal.
 * @see chrome://inspect/#devices
 */
const IS_TRACE_OUTPUT = true;

/**
 * For usage and good practices:
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/wikis/Logger
 */
@Injectable()
export class LoggerService extends ConsoleLogger {
  /**
   * This variable store the colors used by each
   * libraries to display the logs in Chrome Debug Tools.
   */
  private libraryColors: ILoggerColorParams;
  private containerColors: ILoggerColorParams;
  private containerName: string;
  private externalLogger: any;

  /**
   * Memorisation tool already used by Panva.
   * @see https://www.npmjs.com/package/quick-lru
   */
  private cache: QuickLRU<string, any>;

  constructor(private readonly config: ConfigService) {
    super(null);
    const { level, path } = this.config.get<LoggerConfig>('Logger');

    this.setContainerColors();

    this.externalLogger = pino(
      {
        formatters: {
          level(label: string, _number: number) {
            return { level: label };
          },
        },
        level: pinoLevelsMap[level],
      },
      pino.destination(path),
    );

    if (!this.isDev()) {
      this.overrideNativeConsole();
    }

    this.cache = new QuickLRU({ maxSize: 128 });
  }

  private getIdentifiedLog(log) {
    const logId = uuidV4();
    return {
      ...log,
      logId,
    };
  }

  /**
   * @param {LoggerLevelNames} level name
   * @param {any} log
   * @param {any} context
   */
  // istanbul ignore next line
  private internalLogger(level, log, context) {
    // -- Proxy `super`, cause we can't mock a parent class
    super[level](log, context);
    /**
     * @todo FC-539
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/539
     * @author brice
     * @date 2021-06-02
     * Add `if (this.isOutputTrace() && log)` to prevent logs to be written
     * two times in Chrome debugger and terminal.
     */
    if (this.isOutputTrace() && log && context) {
      console[level](log, context);
    }
  }

  private canLog(level: string) {
    return pinoLevelsMap[this.externalLogger.level] <= pinoLevelsMap[level];
  }

  private isDev() {
    return !!this.config.get<LoggerConfig>('Logger').isDevelopment;
  }

  private isOutputTrace() {
    return this.isDev() && IS_TRACE_OUTPUT;
  }

  private technicalLogger(level: string, log: any, context?: string): void {
    if (!this.canLog(level)) {
      return;
    }

    let message = log;
    if (!this.isDev()) {
      try {
        message = JSON.stringify(log);
      } catch (error) {
        this.internalLogger(
          nestLevelsMap.warn,
          'could not JSON stringify a log',
          context,
        );
        message = log;
      }
    }

    this.internalLogger(nestLevelsMap[level], message, context);
  }

  private businessLogger(level: string, log: any, context?: string) {
    // In order to ease the work of developers,
    // we also send business logs at trace level.
    // (This level is inoperative on environment other than dev)
    this.trace({ log, context }, level);

    if (this.canLog(level)) {
      this.externalLogger[level](this.getIdentifiedLog(log));
    }
  }

  private overrideNativeConsole() {
    const methods = ['log', 'error', 'debug', 'info', 'warn'];
    const context = 'Native Console';

    methods.forEach((method) => {
      /**
       * @TODO #257
       * Attention les objects crash :
       * TypeError: Cannot convert object to primitive value
       * et tout ce qui n'est pas primitif.
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/257
       */
      console[method] = (...args) => this[method](args.join('\n'), context);
    });
  }

  // Alias of trace
  log(log: any, context?: string) {
    if (this.isDev()) {
      this.technicalLogger(LoggerLevelNames.LOG, log, context);
    }
  }

  // Method that might add more info in production
  verbose(log: any, context?: string) {
    this.technicalLogger(LoggerLevelNames.VERBOSE, log, context);
  }

  debug(log: any, context?: string) {
    this.technicalLogger(LoggerLevelNames.DEBUG, log, context);
  }

  info(log: any, context?: string) {
    this.technicalLogger(LoggerLevelNames.INFO, log, context);
  }

  // Errors
  warn(log: any, context?: string) {
    this.technicalLogger(LoggerLevelNames.WARN, log, context);
  }

  error(log: any, context?: string) {
    this.technicalLogger(LoggerLevelNames.ERROR, log, context);
  }

  fatal(log: any, context?: string) {
    this.technicalLogger(LoggerLevelNames.FATAL, log, context);
  }

  // Business logic, goes in event logs
  businessEvent(log: ILoggerBusinessEvent, context?: string) {
    this.businessLogger(LoggerLevelNames.INFO, log, context);
  }

  /**
   * Store locally the container name and transcribe its colors
   * and store the color locally.
   * The hostname is the container's name defined in docker-compose.
   *
   * @returns {void}
   */
  private setContainerColors(): void {
    this.containerName = os.hostname() || 'n/a';
    this.containerColors = utils.getColorsFromText(this.containerName);
  }

  /**
   * Store localy all the colors that have to be used
   * to display the current library logs in Chrome Debugger Tool.
   *
   * @param {ILoggerColorParams} colors
   * @returns {void}
   */
  setLibraryColors(colors: ILoggerColorParams): void {
    this.libraryColors = colors;
  }

  /**
   * Override of `setContent()` method called by all libraries.
   * Allow to set basic lib colors with context name.
   *
   * @param {string} context the lib calling the logger, Ex: 'core', 'oidc-client', ...
   * @returns {void}
   */
  setContext(context: string): void {
    super.setContext(context);

    // Library name
    let libraryName: string;
    if (this.cache.has(context)) {
      libraryName = this.cache.get(context);
    } else {
      libraryName = this.getLibraryName(context);
      this.cache.set(context, libraryName);
    }

    // Library color
    let color: ILoggerColorParams;
    if (this.cache.has(libraryName)) {
      color = this.cache.get(libraryName);
    } else {
      color = utils.getColorsFromText(libraryName);
      this.cache.set(libraryName, color);
    }

    this.setLibraryColors(color);
  }

  /**
   * Convert context string name into library name.
   * This supposed that all the software classes are
   * prefixed by the library name, Ex: `MyLibMyClassService`.
   *
   * @param {string} context Convert context string name.
   * @returns {string} library string name.
   */
  private getLibraryName(context: string): string {
    const hasContext: boolean = this.cache.has(context);
    // we call `this.trace()` in `this.businessLogger()`
    // without setting the context through the inherited
    // method `this.setContext()` so we supposed that if
    // no context is provided, it must be the `logger` library.
    let libraryName = 'logger';

    if (context) {
      if (hasContext) {
        libraryName = this.cache.get(context);
      } else {
        libraryName = utils.slugLibName(context);
        this.cache.set(context, libraryName);
      }
    }
    return libraryName;
  }

  /**
   * Try to estimate if the classMethod isfrom a specific type
   * to returns the coresponding color object.
   *
   * @param {string} classMethodName, Ex: 'myClassController.myMethod()'
   * @returns {ILoggerColorParams}
   */
  private getClassMethodColor(classMethodName: string): ILoggerColorParams {
    const {
      loggerColorClassCategoryEnum: categories,
      loggerClassMethodColorsConstant: methodColors,
    } = colors;
    const categoryClassName = Object.keys(categories).find((cat) =>
      classMethodName.includes(`${cat}.`),
    );
    const BACKGROUND_COLOR =
      categories[categoryClassName] || methodColors.BACKGROUND_COLOR;
    return {
      ...methodColors,
      BACKGROUND_COLOR,
    };
  }

  /**
   * Convert the array of color objects into the same array
   * but in css sring. This array is stored in local cache to
   * prevents multiple processing for the same 'container' or 'library'.
   *
   * @param {Array<ILoggerColorParams>} allColors array of object ordered:
   *        0: time
   *        1: container
   *        2: library
   *        3: class-method
   * @returns {Array<string>} Array of css strings in the same order.
   */
  private getDebuggerCssColors(allColors: Array<ILoggerColorParams>): string[] {
    return allColors.map((color: ILoggerColorParams): string => {
      const colorHash: string = JSON.stringify(color);
      let cssStyle: string;

      if (this.cache.has(colorHash)) {
        cssStyle = this.cache.get(colorHash);
      } else {
        cssStyle = utils.getStyle(color);
        this.cache.set(colorHash, cssStyle);
      }
      return cssStyle;
    });
  }

  /**
   * Get the string metadata to display with `this.trace()`
   * It uses `%c` to sequentialy target to the css style to apply.
   *
   * @param {string} dateTime, ex: `12:48 PM`
   * @param {string} containerName, ex: `core-fcp-high`
   * @param {string} libraryName, ex: `oidc-provider`
   * @param {string} classMethodName, ex: `MyClass.myMethod()`
   * @returns {string} metadata, ex: `%c[12:48 PM]%ccore-fcp-highc$oidc-provider%cMyClass.myMethod()`
   */
  private getDebuggerMetadata(
    dateTime: string,
    containerName: string,
    libraryName: string,
    classMethodName: string,
  ): string {
    return `%c${dateTime}%c${containerName}%c${libraryName}%c${classMethodName}()`;
  }

  /**
   * Execute console['log'|'warn'|'error'|'debug']()
   * in function of a log level.
   * @warn impossible to mix color and other console method
   * such as console['table'|'info'|'dir'...]()
   *
   * @param {string} logger level string name, default 'log' for `console.log`
   * @returns {Function} console function to execute.
   */
  private getConsoleCommand(level: string = LoggerLevelNames.LOG): Function {
    const levelKey: string = level.toUpperCase();
    if (LoggerLevelNames[levelKey]) {
      return console[LoggerLevelNames[levelKey]];
    }
    return console[LoggerLevelNames.LOG];
  }

  /**
   * Method for local debuging content in Chrome.
   * Method that will never output in production.
   * @see chrome://inspect#devices
   *
   * @param {any} msg Object or message to display.
   * @param {string} level name from `LoggerLevelNames` enum type, default: 'log' for console.log()
   * @returns {void}
   */
  trace(msg?: any, level: string = LoggerLevelNames.LOG): void {
    if (!this.isOutputTrace()) {
      return;
    }

    const dateTime: string = utils.getDateTime();
    const containerName: string = this.containerName;
    const libraryName: string = this.getLibraryName(this.context);
    const classMethodName: string = utils.getClassMethodCaller();

    const metadata = this.getDebuggerMetadata(
      dateTime,
      containerName,
      libraryName,
      classMethodName,
    );

    const allColors: Array<ILoggerColorParams> = [
      colors.loggerTimeColorsConstant,
      this.containerColors,
      this.libraryColors,
      this.getClassMethodColor(classMethodName),
    ];
    const loggerColors: string[] = this.getDebuggerCssColors(allColors);

    const command: Function = this.getConsoleCommand(level);

    command(metadata, ...loggerColors, msg);
  }
}

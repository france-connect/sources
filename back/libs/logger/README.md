# logger

This service is responsible for logging messages. It is a wrapper around [pino](https://github.com/pinojs/pino/tree/master/docs).
It can handle multiple transports (file descriptor or websocket), log levels, destination and is suitable for tech log as well as business logs.
All logs are emitted as JSON objects.

## Setup

### 1. LoggerModule

The `LoggerModule` is a global module that should be imported in the `AppModule` of the instance. Most of the time it will look like the following:

```typescript
@Module({})
export class AppModule {
  static forRoot(configService: ConfigService): DynamicModule {
    return {
      module: AppModule,
      imports: [
        // 1. Load config module first
        ConfigModule.forRoot(configService),
        // 2. Load logger module next
        LoggerModule,
        // 3. Load other modules
      ],
    };
  }
}
```

### 2. NestLoggerService

The `NestLoggerService` is a service that should be imported in the `main.ts` to provide NestJS an interface to communicate its logs. This should be done as soon as possible in the application lifecycle. Do not forget to set the `bufferLogs` option to `true` to avoid losing logs (or have them logged with NestJS default logger) during the bootstrapping process.

```typescript
const app = await NestFactory.create<NestExpressApplication>(appModule, {
  // ... Other options
  bufferLogs: true,
});

const logger = await app.resolve(NestLoggerService);

app.useLogger(logger);
```

⚠️ This service should not be used directly in the application. It is only used to provide NestJS an interface to communicate its logs.

### 3. LoggerService

The `LoggerService` is the global service that should be used in the application to log messages. Its structure and levels are based on the syslog protocol for a better compatibility with external tools. If defined, it uses the `AsyncLocalStorageModule` to retrieve the current request context and add it to the log message.  
⚠️ You should import the `AsyncLocalStorageModule` in each app that use the logger. It will not be active if there is no middleware set, but is a dependency.

### 3.1 Logs levels

The logger service has 9 levels of logs.

#### 3.1.1 Business log level:

- **`business` (100)**: This is always logged. It is used to log business events and nothing else.

#### 3.1.2 Technical log levels based on the syslog protocol:

⚠️ You **MUST** never log data that can be used to identify a user or to identify secrets. The only acceptable level to log such data is `debug`. Derogations can be granted in production by the security team in case of a critical event to be investigated, but must be traced, justified, limited and removed as soon as possible.

- **`emerg` (80)**: System is unusable
  You should use this level only when the application is not able to continue its execution properly. For example, when the application is not able to connect to the database or lost its connection to a critical service.
- **`alert` (70)**: Action must be taken immediately
  You should use this level when the application is not able to continue its execution properly but is still able to recover or is only partially degraded. For example, when the application is not able to connect to the database but is able to reconnect automatically.
- **`crit` (60)**: Critical conditions
  You should use this level when the application encounter an unexpected error. For example, when a library use `console.error`, it will log a critical since it is uncommon.
- **`err` (50):** Error conditions
  You should use this level when the application encounter an expected error. For example, when a some parameters are invalid on a request.
- **`warning` (40)**: Warning conditions
  You should use this level when the application encounter an unexpected behavior. For example, when an unexpected format is encountered on a non blocking service.
- **`notice` (30)**: Normal but significant condition
  You should use this level when the application need to log a significant technical event. For example, when a service is started or stopped or a cache is refreshed.
- **`info` (20)**: Informational messages
  You should use this level when the application need to log other technical event. For example when you enter in some business branch on the code.
- **`debug` (10)**: Debug-level messages
  You should use this level when the application need to log debug information. For example, when you need to log the content of a variable.

#### 3.1.3 The specific case of the `debug` level

Since the debug level is used to log sensitive data, it is not enabled by default in any environment other than local. It is not mean to be used to log everything everywhere.
Before adding a debug log, you should ask yourself the following questions:

- Is it really necessary to log this data ?
- Did I had trouble to debug this part of the code ?
- Is here the best place to log this data ?
- Is it possible to log only a part of the data to prevent bloats ?

### 3.2 Log format

Since we are using pino, you can either:

- Use the `LoggerService` directly to log a message with the following format:

```typescript
logger.info('Hello world !');
```

- Use the `LoggerService` to log a message with a context:

```typescript
logger.info({ context: { foo: 'bar' } }, 'Hello world !');
```

⚠️ We do not want to use format string, please prefer strings templates:

```typescript
// This is ok 👍
logger.info({ context: { foo: 'bar' } }, `Hello ${name} !`);
```

```typescript
// This is not ok 👎
logger.info({ context: { foo: 'bar' } }, 'Hello %s !', name);
```

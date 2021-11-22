import { Global, Module, Scope } from '@nestjs/common';

import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [
    /**
     * ⚠️ Workarround
     * Export specifying the scope.
     *
     * Note that we have to do this at module time rather than in the @Injectable() decorator,
     * since the testModule will fail to inject dependencies with when scope is transient
     * set in the decorator options.
     *
     * @see https://github.com/nestjs/nest/issues/3419
     * (Although the issue is marked as fixed in v6.10.4 it still happens in v6.10.14)
     *
     * For more context on "why" we need this:
     * @see https://docs.nestjs.com/techniques/logger#using-the-logger-for-application-logging
     * @see https://docs.nestjs.com/fundamentals/injection-scopes#injection-scopes
     */
    {
      provide: LoggerService,
      useClass: LoggerService,
      scope: Scope.TRANSIENT,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}

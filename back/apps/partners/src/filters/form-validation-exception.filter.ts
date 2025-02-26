import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { ApiErrorMessage, ApiErrorParams } from '@fc/app';
import { ConfigService } from '@fc/config';
import {
  MetadataDtoInterface,
  MetadataDtoValidatorsInterface,
  ValidatorType,
} from '@fc/dto2form';
import { Dto2FormValidationErrorException } from '@fc/dto2form/exceptions';
import { BaseException, FcBaseExceptionFilter } from '@fc/exceptions';
import { ExceptionCaughtEvent } from '@fc/exceptions/events';
import { generateErrorId, getClass } from '@fc/exceptions/helpers';
import { LoggerService } from '@fc/logger';

import { PartnersI18nService } from '../services';

@Catch(Dto2FormValidationErrorException)
@Injectable()
export class FormValidationExceptionFilter
  extends FcBaseExceptionFilter
  implements ExceptionFilter
{
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly eventBus: EventBus,
    private readonly partners: PartnersI18nService,
  ) {
    super(config, logger, eventBus);
  }

  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const exceptionConstructor = getClass(exception);

    const code = this.getExceptionCodeFor(exception);
    const id = generateErrorId();
    const message = exceptionConstructor.UI;

    // Translate
    const exceptionLogI18n = this.partners.translation(
      exception.log as unknown as MetadataDtoInterface[],
    );

    const exceptioni18nToFinalForm =
      this.transformToFinalForm(exceptionLogI18n);

    exception.log = exceptioni18nToFinalForm;

    // @todo: weird Naming / structure
    const errorMessage: ApiErrorMessage = { code, id, message };
    const exceptionParam = this.getParams(exception, errorMessage, res);

    this.eventBus.publish(new ExceptionCaughtEvent(exception, { req }));

    this.errorOutput(exceptionParam);
  }

  protected errorOutput(errorParam: ApiErrorParams): void {
    const { httpResponseCode, res, error: baseError, exception } = errorParam;
    const { error, error_description, error_detail } = exception as any;

    res.status(httpResponseCode);
    res.json({
      ...baseError,
      error,
      error_description,
      error_detail,
      payload: exception.log,
    });
  }

  private transformToFinalForm(
    payload: MetadataDtoInterface[],
  ): Record<string, unknown[]> {
    return payload.reduce(
      (acc, field) => {
        const { name, validators } = field;
        const hasValidators = validators && validators.length > 0;

        if (hasValidators) {
          acc[name] = this.getErrorLabels(validators);
        }

        return acc;
      },
      {} as Record<string, unknown[]>,
    );
  }

  private getErrorLabels(validators: ValidatorType): unknown[] {
    return validators.map((validator) => this.extractErrorLabel(validator));
  }

  private extractErrorLabel(
    validator:
      | MetadataDtoValidatorsInterface
      | MetadataDtoValidatorsInterface[],
  ): unknown {
    if (Array.isArray(validator)) {
      return validator.map((v) => this.extractErrorLabel(v));
    }
    return validator.errorLabel;
  }
}

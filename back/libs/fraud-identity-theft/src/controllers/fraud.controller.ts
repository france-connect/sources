import { ClassTransformOptions } from 'class-transformer';
import { v4 as uuid } from 'uuid';

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Injectable,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { getTransformed } from '@fc/common';
import { CsmrFraudClientService, FraudMessageDto } from '@fc/csmr-fraud-client';
import { ActionTypes } from '@fc/csmr-fraud-client/protocol';
import { CsrfTokenGuard } from '@fc/csrf';
import {
  Dto2FormI18nService,
  FormValidationPipe,
  MetadataDtoInterface,
  MetadataFormService,
} from '@fc/dto2form';
import { PivotIdentityDto } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService, Session } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';
import { FormattedIdpSettingDto } from '@fc/user-preferences';

import {
  FraudCaseSessionDto,
  FraudConnectionEndpointSessionDto,
  FraudConnectionFormDto,
  FraudContactEndpointSessionDto,
  FraudContactFormDto,
  FraudDescriptionFormDto,
  FraudFormValuesDto,
  FraudIdentityEndpointSessionDto,
  FraudIdentityFormDto,
  FraudSummaryEndpointSessionDto,
  FraudSummaryFormDto,
} from '../dto';
import { FraudIdentityTheftRoutes } from '../enums';
import { HttpErrorResponse, OidcIdentityInterface } from '../interfaces';
import { FraudIdentityTheftService } from '../services';

const FILTERED_OPTIONS: ClassTransformOptions = {
  excludeExtraneousValues: true,
};

@Injectable()
@Controller()
export class FraudController {
  // more params, allowed for DI
  // eslint-disable-next-line max-params
  constructor(
    @Inject('Fraud')
    private readonly fraud: CsmrFraudClientService,
    private readonly tracking: TrackingService,
    private readonly metadataFormService: MetadataFormService,
    private readonly fraudIdentityTheft: FraudIdentityTheftService,
    private readonly dto2FormI18n: Dto2FormI18nService,
  ) {}

  @Get(FraudIdentityTheftRoutes.FRAUD_NO_AUTH_DESCRIPTION)
  getFraudDescription(): MetadataDtoInterface[] {
    const payload = this.metadataFormService.getDtoMetadata(
      FraudDescriptionFormDto,
    );

    const payloadI18n = this.dto2FormI18n.translation(payload);

    return payloadI18n;
  }

  @Post(FraudIdentityTheftRoutes.FRAUD_NO_AUTH_DESCRIPTION)
  @UsePipes(FormValidationPipe)
  @UseGuards(CsrfTokenGuard)
  postFraudDescription(
    @Res() res,
    @Body() body: FraudDescriptionFormDto,
    @Session('FraudCase')
    sessionFraudCase: ISessionService<FraudCaseSessionDto>,
  ) {
    sessionFraudCase.set({ description: body });

    return res.status(HttpStatus.OK).send();
  }

  @Get(FraudIdentityTheftRoutes.FRAUD_NO_AUTH_CONNECTION)
  getFraudConnection(
    // We know that this session is unused in the method but
    // we use @Session decorator to ensure the session has the right type.
    @Session('FraudCase', FraudConnectionEndpointSessionDto)
    _sessionFraudCase: ISessionService<FraudCaseSessionDto>,
  ): MetadataDtoInterface[] {
    const payload = this.metadataFormService.getDtoMetadata(
      FraudConnectionFormDto,
    );

    const payloadI18n = this.dto2FormI18n.translation(payload);

    return payloadI18n;
  }

  @Post(FraudIdentityTheftRoutes.FRAUD_NO_AUTH_CONNECTION)
  @UsePipes(FormValidationPipe)
  @UseGuards(CsrfTokenGuard)
  postFraudConnection(
    @Res() res,
    @Body() body: FraudConnectionFormDto,
    @Session('FraudCase', FraudConnectionEndpointSessionDto)
    sessionFraudCase: ISessionService<FraudCaseSessionDto>,
  ) {
    sessionFraudCase.set({ connection: body });

    return res.status(HttpStatus.OK).send();
  }

  @Get(FraudIdentityTheftRoutes.FRAUD_NO_AUTH_IDENTITY)
  getFraudIdentity(
    // We know that this session is unused in the method but
    // we use @Session decorator to ensure the session has the right type.
    @Session('FraudCase', FraudIdentityEndpointSessionDto)
    _sessionFraudCase: ISessionService<FraudCaseSessionDto>,
  ): MetadataDtoInterface[] {
    const payload =
      this.metadataFormService.getDtoMetadata(FraudIdentityFormDto);

    const payloadI18n = this.dto2FormI18n.translation(payload);

    return payloadI18n;
  }

  @Post(FraudIdentityTheftRoutes.FRAUD_NO_AUTH_IDENTITY)
  @UsePipes(FormValidationPipe)
  @UseGuards(CsrfTokenGuard)
  postFraudIdentity(
    @Res() res,
    @Body() body: FraudIdentityFormDto,
    @Session('FraudCase', FraudIdentityEndpointSessionDto)
    sessionFraudCase: ISessionService<FraudCaseSessionDto>,
  ) {
    sessionFraudCase.set({ identity: body });

    return res.status(HttpStatus.OK).send();
  }

  @Get(FraudIdentityTheftRoutes.FRAUD_NO_AUTH_CONTACT)
  getFraudContact(
    // We know that this session is unused in the method but
    // we use @Session decorator to ensure the session has the right type.
    @Session('FraudCase', FraudContactEndpointSessionDto)
    _sessionFraudCase: ISessionService<FraudCaseSessionDto>,
  ): MetadataDtoInterface[] {
    const payload =
      this.metadataFormService.getDtoMetadata(FraudContactFormDto);

    const payloadI18n = this.dto2FormI18n.translation(payload);

    return payloadI18n;
  }

  @Post(FraudIdentityTheftRoutes.FRAUD_NO_AUTH_CONTACT)
  @UsePipes(FormValidationPipe)
  @UseGuards(CsrfTokenGuard)
  postFraudContact(
    @Res() res,
    @Body() body: FraudContactFormDto,
    @Session('FraudCase', FraudContactEndpointSessionDto)
    sessionFraudCase: ISessionService<FraudCaseSessionDto>,
  ) {
    sessionFraudCase.set({ contact: body });

    return res.status(HttpStatus.OK).send();
  }

  @Get(FraudIdentityTheftRoutes.FRAUD_NO_AUTH_SUMMARY)
  getFraudSummaryData(
    @Session('FraudCase', FraudSummaryEndpointSessionDto)
    sessionFraudCase: ISessionService<FraudCaseSessionDto>,
  ): {
    summary: FraudCaseSessionDto;
    form: MetadataDtoInterface[];
  } {
    const summary = sessionFraudCase.get();
    const form = this.metadataFormService.getDtoMetadata(FraudSummaryFormDto);

    const formI18n = this.dto2FormI18n.translation(form);

    const payload = {
      summary,
      form: formI18n,
    };

    return payload;
  }

  @Post(FraudIdentityTheftRoutes.FRAUD_NO_AUTH_SUMMARY)
  @UsePipes(FormValidationPipe)
  @UseGuards(CsrfTokenGuard)
  async postFraudSummary(
    @Req() req,
    @Res() res,
    // We need to have body to validate if consent checkbox is checked
    // but we don't use it in the method.
    @Body() _body: FraudSummaryFormDto,
    @Session('FraudCase', FraudSummaryEndpointSessionDto)
    sessionFraudCase: ISessionService<FraudCaseSessionDto>,
  ) {
    const summary = sessionFraudCase.get();

    const pivotIdentity = this.fraudIdentityTheft.transformToPivotIdentity(
      summary.identity,
    );
    const fraudCase = this.fraudIdentityTheft.buildFraudCase(summary);

    const message: FraudMessageDto = {
      type: ActionTypes.PROCESS_UNVERIFIED_IDENTITY_FRAUD_CASE,
      payload: {
        identity: pivotIdentity,
        fraudCase,
      },
    };

    const { payload: fraudCaseTrackingData } =
      await this.fraud.publish(message);

    const { FRAUD_CASE_OPENED } = this.tracking.TrackedEventsMap;

    const context: TrackedEventContextInterface = {
      req,
      identity: pivotIdentity,
      fraudCaseContext: {
        ...fraudCaseTrackingData,
        isAuthenticated: false,
      },
    };

    await this.tracking.track(FRAUD_CASE_OPENED, context);

    return res.status(HttpStatus.OK).send();
  }

  @Post(FraudIdentityTheftRoutes.FRAUD_FORM)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(CsrfTokenGuard)
  async processFraudForm(
    @Res() res,
    @Req() req,
    @Body() body: FraudFormValuesDto,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<FormattedIdpSettingDto | HttpErrorResponse> {
    const idpIdentity = sessionOidc.get('idpIdentity') as OidcIdentityInterface;
    if (!idpIdentity) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    const identityFiltered = getTransformed<PivotIdentityDto>(
      idpIdentity,
      PivotIdentityDto,
      FILTERED_OPTIONS,
    );

    const id = uuid();

    const message = {
      type: ActionTypes.PROCESS_VERIFIED_IDENTITY_FRAUD_CASE,
      payload: {
        identity: identityFiltered,
        fraudCase: {
          ...body,
          id,
        },
      },
    };

    const { payload: fraudCaseTrackingData } =
      await this.fraud.publish(message);

    const { FRAUD_CASE_OPENED } = this.tracking.TrackedEventsMap;

    const context: TrackedEventContextInterface = {
      req,
      identity: idpIdentity,
      fraudCaseContext: {
        ...fraudCaseTrackingData,
        isAuthenticated: true,
      },
    };

    await this.tracking.track(FRAUD_CASE_OPENED, context);

    return res.status(HttpStatus.OK).send();
  }
}

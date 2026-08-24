import { Request, Response } from 'express';

import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Render,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';

import {
  AuthorizeErrorQueryDto,
  AuthorizeQueryDto,
  SelectIdentityQueryDto,
  SubmitBodyDto,
  SubmitErrorBodyDto,
} from '../dto';
import { Flows, MockWalletRoutes } from '../enums';
import {
  ConsentViewModel,
  IdentitySelectViewModel,
  SubmitResult,
} from '../interfaces';
import { MockWalletFlowService } from '../services';

@Controller()
export class MockWalletController {
  constructor(
    private readonly config: ConfigService,
    private readonly flow: MockWalletFlowService,
  ) {}

  @Get(MockWalletRoutes.HOME)
  @Render('index')
  home() {
    return {
      selectIdentityUrl: MockWalletRoutes.WALLET_SELECT_IDENTITY,
    };
  }

  @Get(MockWalletRoutes.WALLET_SELECT_IDENTITY)
  @Render('identity-select')
  @Header('cache-control', 'no-store')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  selectIdentity(
    @Query() query: SelectIdentityQueryDto,
  ): IdentitySelectViewModel {
    const { deepLink, flow } = query;
    return this.flow.selectIdentity(deepLink, flow);
  }

  @Get(MockWalletRoutes.WALLET_AUTHORIZE)
  @Render('consent')
  @Header('cache-control', 'no-store')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async authorize(
    @Query() query: AuthorizeQueryDto,
  ): Promise<ConsentViewModel> {
    const { deepLink, identityIndex, flow } = query;
    return await this.flow.authorize(deepLink, flow, identityIndex);
  }

  @Post(MockWalletRoutes.WALLET_SUBMIT)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async submit(
    @Body() body: SubmitBodyDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.flow.submit(body);

    this.renderSubmitResult(body.flow, result, req, res);
  }

  @Post(MockWalletRoutes.WALLET_SUBMIT_ERROR)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async submitError(
    @Body() body: SubmitErrorBodyDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.flow.submitError(body);

    this.renderSubmitResult(body.flow, result, req, res);
  }

  @Get(MockWalletRoutes.WALLET_AUTHORIZE_SUBMIT)
  @Header('cache-control', 'no-store')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async authorizeSubmit(
    @Query() query: AuthorizeQueryDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const { deepLink, identityIndex, flow } = query;

    const consentViewModel = await this.flow.authorize(
      deepLink,
      flow,
      identityIndex,
    );

    const submitBody: SubmitBodyDto = {
      responseUri: consentViewModel.responseUri,
      requestPayload: JSON.parse(consentViewModel.requestPayload),
      responsePayload: JSON.parse(consentViewModel.responsePayload),
      flow,
    };

    await this.submit(submitBody, req, res);
  }

  @Get(MockWalletRoutes.WALLET_AUTHORIZE_ERROR_SUBMIT)
  @Header('cache-control', 'no-store')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async authorizeErrorSubmit(
    @Query() query: AuthorizeErrorQueryDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const { deepLink, flow, error, errorDescription } = query;

    const result = await this.flow.authorizeError(
      deepLink,
      error,
      errorDescription,
    );

    this.renderSubmitResult(flow, result, req, res);
  }

  @Get(MockWalletRoutes.WALLET_HEALTH)
  @Header('cache-control', 'no-store')
  health() {
    const { name } = this.config.get<AppConfig>('App');

    return { status: 'ok', name };
  }

  private renderSubmitResult(
    flow: Flows,
    result: SubmitResult,
    req: Request,
    res: Response,
  ): void {
    const { redirectUri, statusCode, responseBody } = result;

    if (flow === Flows.SAME_DEVICE && redirectUri) {
      res.redirect(redirectUri);
      return;
    }

    if (req.accepts('html')) {
      res.render('result', {
        statusCode,
        responseBody,
        redirectUri,
        indexUrl: MockWalletRoutes.HOME,
        flow,
      });
      return;
    }

    res.json({ statusCode, responseBody, redirectUri });
  }
}

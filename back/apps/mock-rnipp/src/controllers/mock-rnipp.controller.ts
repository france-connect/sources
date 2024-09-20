import * as path from 'path';

import { NextFunction, Response } from 'express';

import {
  Controller,
  Get,
  HttpStatus,
  Next,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { LoggerService } from '@fc/logger';

import { ScenarioQueryDto } from '../dto';
import { MockRnippRoutes, RnippCode, Scenario } from '../enums';
import { SuccessfullResponseInterface } from '../interfaces';
import { MockRnippService } from '../services';

@Controller()
export class MockRnippController {
  constructor(
    private readonly mockRnippService: MockRnippService,
    private readonly logger: LoggerService,
  ) {}

  @Get(MockRnippRoutes.HEALTH_CHECK)
  healthCheck() {
    return 'OK';
  }

  @Get(MockRnippRoutes.BASE)
  @UsePipes(new ValidationPipe())
  handleScenario(
    @Query() query: ScenarioQueryDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const exceptionKey = this.mockRnippService.getExceptionKey(query.prenoms);
    this.logger.info(`Found exceptionKey ${exceptionKey}`);

    const { codeLieuNaissance } = query;
    const rnippCode = this.mockRnippService.getRnippCode(
      codeLieuNaissance,
      exceptionKey,
    );

    const scenario = this.mockRnippService.getScenario(exceptionKey);

    switch (scenario) {
      case Scenario.SUCCESS:
        const ejsContext = this.getSucessfullResponse(query, rnippCode);
        res.setHeader('content-type', 'text/xml');
        res.render('OK', ejsContext);
        break;
      case Scenario.TIMEOUT:
        setTimeout(() => {
          next();
        }, 7000);
        break;
      case Scenario.ERROR:
        res.sendFile(`responses/${exceptionKey}.xml`, {
          root: path.join(__dirname),
        });
    }
  }

  @Get('*')
  defaultController(@Res() res: Response) {
    return res
      .status(HttpStatus.SEE_OTHER)
      .redirect('/Brpp2IdentificationComplet/individus');
  }

  private getSucessfullResponse(
    query: ScenarioQueryDto,
    rnippCode: RnippCode,
  ): SuccessfullResponseInterface {
    const { prenoms, dateNaissance } = query;

    const formattedDate = this.mockRnippService.formatDate(dateNaissance);
    const formattedName = this.mockRnippService.formatName(prenoms);
    const ejsContext = {
      ...query,
      dateNaissance: formattedDate,
      prenoms: formattedName,
      status: rnippCode,
    };
    return ejsContext;
  }
}

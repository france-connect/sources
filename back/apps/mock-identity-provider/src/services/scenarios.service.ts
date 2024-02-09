import { readFileSync } from 'fs';

import { KoaContextWithOIDC } from 'oidc-provider';

import { Injectable } from '@nestjs/common';

import { asyncFilter, validateDto, wait } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity } from '@fc/oidc';

import { AppConfig, ScenarioDto } from '../dto';
import { Scenario } from '../enums';

@Injectable()
export class ScenariosService {
  private scenarios: ScenarioDto[] = [];

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const { scenariosDatabasePath } = this.config.get<AppConfig>('App');

    const scenarios = JSON.parse(
      readFileSync(scenariosDatabasePath, { encoding: 'utf-8' }),
    );

    this.scenarios = await asyncFilter<ScenarioDto[]>(
      scenarios,
      async (scenario) => {
        const { length: error } = await validateDto(
          scenario,
          ScenarioDto,
          validationOptions,
        );

        if (error) {
          this.logger.warning(`Invalid scenario found: ${scenario?.name}`);
        }

        return !error;
      },
    );
  }

  async alterServerResponse(
    login: string,
    ctx: KoaContextWithOIDC,
  ): Promise<boolean> {
    const scenario = this.find(login, Scenario.SERVER_RESPONSE);

    if (!scenario) {
      return false;
    }

    if (scenario.delay) {
      await wait(scenario.delay);
    }

    ctx.status = scenario.status;
    ctx.body = scenario.body;

    return true;
  }

  deleteClaims(
    login: string,
    spIdentity: Partial<IOidcIdentity>,
    subSp: string,
  ): Partial<Omit<IOidcIdentity, 'sub'>> {
    const scenario = this.find(login, Scenario.DELETE_CLAIMS);

    const claims = {
      ...spIdentity,
      sub: subSp,
    };

    if (!scenario) {
      return claims;
    }

    scenario.claims.map((claim) => {
      delete claims[claim];
    });

    return claims;
  }

  private find(login: string, type: Scenario): ScenarioDto {
    return this.scenarios.find((scenario) => {
      return login === scenario.login && type === scenario.type;
    });
  }
}

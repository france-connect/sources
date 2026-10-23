import { uniqBy } from 'lodash';

import { Injectable } from '@nestjs/common';

import { CogService } from '@fc/cog';
import { EudiPidBirthPlaceInterface } from '@fc/eudi';

import { isFrenchCog, normalizeCityName } from '../helpers';
import { ResolutionContextInterface } from '../interfaces';
import { BaseResolver } from './base.resolver';

@Injectable()
export class InseeResolver extends BaseResolver {
  constructor(private readonly cogService: CogService) {
    super();
  }

  foreignCountry(
    birthPlace: EudiPidBirthPlaceInterface,
    context: ResolutionContextInterface,
  ) {
    const { country } = birthPlace;

    if (!country) {
      return;
    }

    const birthcountry = this.cogService.getCountryCogFromIso(country);

    context.result.birthcountry = birthcountry;
  }

  frenchCity(
    birthPlace: EudiPidBirthPlaceInterface,
    context: ResolutionContextInterface,
  ) {
    if (!this.canResolveFrenchCity(birthPlace, context)) {
      return;
    }

    /**
     * @NOTE PID region is not a guaranteed department code. US #2688 defers
     * department matching until the France Identité issuer convention is defined.
     */
    const names = new Set([
      normalizeCityName(birthPlace.locality),
      normalizeCityName(birthPlace.locality, true),
    ]);
    const cities = uniqBy(
      [...names].flatMap((name) => this.cogService.getCitiesByNcc(name)),
      'lastComparent',
    );

    /**
     * Guessing between homonyms would send a wrong COG, and the RNIPP rejects it.
     * A later resolver could arbitrate, using `context.data`.
     */
    if (cities.length !== 1) {
      return;
    }

    context.result.birthplace = cities[0].lastComparent;
  }

  private canResolveFrenchCity(
    birthPlace: EudiPidBirthPlaceInterface,
    context: ResolutionContextInterface,
  ): boolean {
    const { birthcountry } = context.result;
    const { locality } = birthPlace;

    if (!birthcountry || !locality) {
      return false;
    }

    return isFrenchCog(birthcountry);
  }
}

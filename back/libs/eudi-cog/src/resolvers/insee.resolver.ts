import { Injectable } from '@nestjs/common';

import { CogService } from '@fc/cog';
import { EudiPidBirthPlaceInterface } from '@fc/eudi';

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
}

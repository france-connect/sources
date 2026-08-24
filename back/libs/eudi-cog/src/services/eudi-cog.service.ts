import { Injectable } from '@nestjs/common';

import { FunctionSafe } from '@fc/common';
import { EudiPidBirthPlaceInterface } from '@fc/eudi';

import { FRANCE_COG_LIST } from '../constants';
import { ResolutionContextInterface } from '../interfaces';
import { InseeResolver } from '../resolvers';

@Injectable()
export class EudiCogService {
  private resolvers: FunctionSafe[] = [];

  constructor(private readonly inseeResolver: InseeResolver) {}

  onModuleInit() {
    this.resolvers = [this.inseeResolver.getResolver('foreignCountry')];
  }

  resolveCog(
    birthPlace: EudiPidBirthPlaceInterface,
  ): ResolutionContextInterface['result'] {
    const context: ResolutionContextInterface = {
      result: {
        birthplace: undefined,
        birthcountry: undefined,
      },
    };

    for (const resolver of this.resolvers) {
      if (this.isResolved(context)) {
        return context.result;
      }

      resolver(birthPlace, context);
    }

    return context.result;
  }

  private isResolved(context: ResolutionContextInterface): boolean {
    const { birthcountry, birthplace } = context.result;

    if (!birthcountry) {
      return false;
    }

    if (!this.isFrench(birthcountry)) {
      return true;
    }

    if (!birthplace) {
      return false;
    }

    return true;
  }

  private isFrench(countryCog: string): boolean {
    return FRANCE_COG_LIST.includes(countryCog);
  }
}

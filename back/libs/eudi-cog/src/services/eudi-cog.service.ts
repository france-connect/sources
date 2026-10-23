import { Injectable } from '@nestjs/common';

import { FunctionSafe } from '@fc/common';
import { EudiPidBirthPlaceInterface } from '@fc/eudi';

import { isFrenchCog } from '../helpers';
import { ResolutionContextInterface } from '../interfaces';
import { InseeResolver } from '../resolvers';

@Injectable()
export class EudiCogService {
  private resolvers: FunctionSafe[] = [];

  constructor(private readonly inseeResolver: InseeResolver) {}

  onModuleInit() {
    this.resolvers = [
      this.inseeResolver.getResolver('foreignCountry'),
      this.inseeResolver.getResolver('frenchCity'),
    ];
  }

  resolveCog(
    birthPlace: EudiPidBirthPlaceInterface,
  ): ResolutionContextInterface['result'] {
    const context: ResolutionContextInterface = {
      result: {
        birthplace: '',
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

    if (!isFrenchCog(birthcountry)) {
      return true;
    }

    if (!birthplace) {
      return false;
    }

    return true;
  }
}

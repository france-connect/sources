import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { RepositoryInterface } from '@fc/csv/interfaces';

import { CogConfig } from './dto';
import { CityInterface, CountryInterface } from './interfaces';
import { COG_CITY, COG_COUNTRY } from './tokens';

@Injectable()
export class CogService {
  constructor(
    private readonly config: ConfigService,
    @Inject(COG_CITY)
    private readonly cityManager: RepositoryInterface<CityInterface>,
    @Inject(COG_COUNTRY)
    private readonly countryManager: RepositoryInterface<CountryInterface>,
  ) {}

  async onModuleInit() {
    const { [COG_CITY]: city, [COG_COUNTRY]: country } =
      this.config.get<CogConfig>('Cog');
    await this.cityManager.parse(city);
    await this.countryManager.parse(country);
  }

  /**
   * @param {string} cog
   * @returns {string} label
   */
  async getLabelFromCog(cog: string): Promise<string> {
    const isFrance = !cog.startsWith('99');
    let label;
    if (isFrance) {
      const { com, libelle } = await this.cityManager.find({ com: cog });
      label = `${libelle} - ${com}, FRANCE (FR)`;
    } else {
      const { codeiso2, libcog } = await this.countryManager.find({ cog });
      label = `${libcog} (${codeiso2})`;
    }
    return label;
  }

  /**
   *
   * @param {string[]} cogs
   * @returns {string[]} labels
   */
  async injectLabelsForCogs(cogs: string[]): Promise<string[]> {
    const labels = await Promise.all(
      cogs.map((cog) => this.getLabelFromCog(cog)),
    );
    return labels;
  }
}

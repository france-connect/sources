import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { RepositoryInterface } from '@fc/csv/interfaces';

import { CogConfig } from './dto';
import {
  CityInterface,
  CountryInterface,
  IsoCogCountryInterface,
} from './interfaces';
import { COG_CITY, COG_COUNTRY, COG_ISO_COUNTRY } from './tokens';

@Injectable()
export class CogService {
  constructor(
    private readonly config: ConfigService,
    @Inject(COG_CITY)
    private readonly cityManager: RepositoryInterface<CityInterface>,
    @Inject(COG_COUNTRY)
    private readonly countryManager: RepositoryInterface<CountryInterface>,
    @Inject(COG_ISO_COUNTRY)
    private readonly isoCogCountryManager: RepositoryInterface<IsoCogCountryInterface>,
  ) {}

  async onModuleInit() {
    const {
      [COG_CITY]: city,
      [COG_COUNTRY]: country,
      [COG_ISO_COUNTRY]: isoCogCountry,
    } = this.config.get<CogConfig>('Cog');
    await this.cityManager.parse(city);
    this.cityManager.createIndex('com');
    await this.countryManager.parse(country);
    this.countryManager.createIndex('cog');
    await this.isoCogCountryManager.parse(isoCogCountry);
    this.isoCogCountryManager.createIndex('iso');
  }

  /**
   * @param {string} cog
   * @returns {string} label
   */
  getLabelFromCog(cog: string): string {
    const isFrance = !cog.startsWith('99');
    let label: string;

    if (isFrance) {
      const { com, libelle } = this.cityManager.getByIndex('com', cog);
      label = `${libelle} - ${com}, FRANCE (FR)`;
    } else {
      const { codeiso2, libcog } = this.countryManager.getByIndex('cog', cog);
      label = `${libcog} (${codeiso2})`;
    }
    return label;
  }

  /**
   *
   * @param {string[]} cogs
   * @returns {string[]} labels
   */
  injectLabelsForCogs(cogs: string[]): string[] {
    const labels = cogs.map((cog) => this.getLabelFromCog(cog));

    return labels;
  }

  getCountryCogFromIso(iso: string): string | undefined {
    const row = this.isoCogCountryManager.getByIndex('iso', iso);

    return row?.cog;
  }
}

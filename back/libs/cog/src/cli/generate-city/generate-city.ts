import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { generateCSVContent } from '@fc/csv';

import { FilesName, Folder } from '../enums';
import { getCwdForDirectory, readCSV } from '../helpers';
import {
  InseeDbCityComerInterface,
  InseeDbCityCurrentInterface,
  InseeDbCitySince1943Interface,
  PostalCodesDbCurrentInterface,
  SearchDbCityInterface,
} from '../interface';

export const MATCHING_COLUMN = '#Code_commune_INSEE';
export const EXCLUDE_TYPECOM = 'COMD';

export class GenerateCity {
  constructor() {}

  // we must to check we receive 4 files
  // eslint-disable-next-line complexity
  async run([inseeSince1943, postalCodes, inseeCurrent, inseeComer]: [
    string?,
    string?,
    string?,
    string?,
  ]): Promise<void> {
    if (!inseeSince1943) {
      console.log(
        'Please provide the path to the 1st CSV file as an argument (insee file since 1943).',
      );
      return;
    } else if (!postalCodes) {
      console.log(
        'Please provide the path to the 2nd CSV file as an argument (La poste file).',
      );
      return;
    } else if (!inseeCurrent) {
      console.log(
        'Please provide the path to the 3nd CSV file as an argument (insee current file).',
      );
      return;
    } else if (!inseeComer) {
      console.log(
        'Please provide the path to the 4th CSV file as an argument (insee comer file).',
      );
      return;
    }

    await this.mergeCsvFiles(
      inseeSince1943,
      postalCodes,
      inseeCurrent,
      inseeComer,
    );
  }

  private async mergeCsvFiles(
    inseeSince1943: string,
    postalCodes: string,
    inseeCurrent: string,
    inseeComer: string,
  ): Promise<void> {
    try {
      const searchResultInseeSince1943: InseeDbCitySince1943Interface[] =
        await readCSV(inseeSince1943);
      const searchResultPostalCodes: PostalCodesDbCurrentInterface[] =
        await readCSV(postalCodes);
      const searchResultInseeCurrent: InseeDbCityCurrentInterface[] =
        await readCSV(inseeCurrent);
      const searchResultInseeComer: InseeDbCityComerInterface[] =
        await readCSV(inseeComer);

      const dataBase = this.prepareDataBase(searchResultInseeCurrent);

      const databaseWithComer = this.addComerToDatabase(
        dataBase,
        searchResultInseeComer,
      );

      const dataWithPostalCode = this.matchPostalCode(
        databaseWithComer,
        searchResultPostalCodes,
      );

      const rawSearchData = this.matchOldCog(
        dataWithPostalCode,
        searchResultInseeSince1943,
      );

      const searchData = this.removeDuplicates(rawSearchData).sort(
        (a: SearchDbCityInterface, b: SearchDbCityInterface) =>
          a.name.localeCompare(b.name),
      );

      this.writeCsvFile(searchData);
    } catch (err) {
      console.error('Error:', err);
    }
  }

  private prepareDataBase(
    searchResultInseeCurrent: InseeDbCityCurrentInterface[],
  ): Partial<SearchDbCityInterface>[] {
    return searchResultInseeCurrent
      .filter(
        ({ TYPECOM }: InseeDbCityCurrentInterface) =>
          TYPECOM !== EXCLUDE_TYPECOM,
      )
      .map(({ COM: cog, NCC: name }: InseeDbCityCurrentInterface) => {
        return { cog, name };
      });
  }

  private addComerToDatabase(
    dataBase: Partial<SearchDbCityInterface>[],
    searchResultInseeComer: InseeDbCityComerInterface[],
  ): Partial<SearchDbCityInterface>[] {
    const databaseComer = searchResultInseeComer.map(
      ({ COM_COMER: cog, NCC: name }: InseeDbCityComerInterface) => {
        return { cog, name };
      },
    );
    dataBase.push(...databaseComer);
    return dataBase;
  }

  private matchPostalCode(
    dataBase: Partial<SearchDbCityInterface>[],
    searchResultPostalCodes: PostalCodesDbCurrentInterface[],
  ): SearchDbCityInterface[] {
    return dataBase.map(({ cog, name }: Partial<SearchDbCityInterface>) => {
      const {
        Nom_de_la_commune: abr,
        Code_postal: cp,
        Ligne_5: specificPlace,
      } = searchResultPostalCodes.find(
        // We only do simple matching so it's not unreasonable to use this nested callback
        // eslint-disable-next-line max-nested-callbacks
        (item: PostalCodesDbCurrentInterface) => item[MATCHING_COLUMN] === cog,
      ) || {};

      return { cog, name, abr, cp, specificPlace };
    });
  }

  private matchOldCog(
    dataWithPostalCode: SearchDbCityInterface[],
    searchResultInseeSince1943: InseeDbCitySince1943Interface[],
  ): SearchDbCityInterface[] {
    return dataWithPostalCode.reduce(
      (
        acc: SearchDbCityInterface[],
        { cog, name, abr, cp, specificPlace }: SearchDbCityInterface,
      ) => {
        acc.push({ cog, name, abr, cp, specificPlace });

        searchResultInseeSince1943
          .filter(
            // We only do simple matching so it's not unreasonable to use this nested callback
            // eslint-disable-next-line max-nested-callbacks
            ({ COM, NCC }: InseeDbCitySince1943Interface) =>
              NCC === name && cog !== COM,
          )
          // We only do simple formatting so it's not unreasonable to use this nested callback
          // eslint-disable-next-line max-nested-callbacks
          .forEach(({ COM, NCC }: InseeDbCitySince1943Interface) => {
            acc.push({ cog: COM, name: NCC, abr, cp: 'N/A', specificPlace });
          });

        return acc;
      },
      [],
    );
  }

  private removeDuplicates(
    rawSearchData: SearchDbCityInterface[],
  ): SearchDbCityInterface[] {
    return rawSearchData.reduce(
      (acc: SearchDbCityInterface[], item: SearchDbCityInterface) => {
        const nbFound = acc.filter(
          // We only do simple matching so it's not unreasonable to use this nested callback
          // eslint-disable-next-line max-nested-callbacks
          (a: SearchDbCityInterface) =>
            a.cog === item.cog && a.name === item.name,
        ).length;

        if (nbFound === 0) {
          acc.push(item);
        }

        return acc;
      },
      [],
    );
  }

  private writeCsvFile(searchData: SearchDbCityInterface[]): void {
    const targetDirectory = getCwdForDirectory(
      Folder.TARGET_DIRECTORY_FOR_FCAPPS,
    );
    const filenameCsv = FilesName.CITY;
    const fileContent = generateCSVContent(searchData);

    if (!existsSync(targetDirectory)) {
      mkdirSync(targetDirectory, { recursive: true });
      console.log(`Directory "${targetDirectory}" has been created`);
    }

    const filePath = join(targetDirectory, filenameCsv);

    writeFileSync(filePath, fileContent);
    console.log(`${filenameCsv} was created with success into ${filePath}`);
  }
}

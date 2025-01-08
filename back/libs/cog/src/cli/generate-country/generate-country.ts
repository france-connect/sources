import * as readline from 'readline';

import { FIND_OCCURENCES, REPLACE_BY_SPACE } from '../constants';
import { Apps, Folder } from '../enums';
import {
  readCSV,
  replaceAllOccurrences,
  ReplaceEmptyIsoCode,
  saveCsvToFile,
} from '../helpers';
import {
  InseeDbCountryCurrentInterface,
  SearchDbCountryInterface,
} from '../interface';

export class GenerateCountry {
  static async run([countryFile, apps]: [string?, string?]): Promise<void> {
    if (!countryFile) {
      console.log('Please provide the path to the CSV file as an argument.');
      return;
    }

    if (!apps) {
      // eslint-disable-next-line no-param-reassign
      apps = await new Promise<string>((resolve) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question(
          `
────────────────────────────────────────────────────────────────────────────────
  🎯 No apps specified.
  ➡️  Do you want to generate for:
      [1] "eidas"
      [2] "fc-apps" (default)

  Please choose an option [1 or 2]: 
────────────────────────────────────────────────────────────────────────────────
`,
          (answer) => {
            rl.close();
            resolve(answer === '1' ? Apps.EIDAS : Apps.FCAPPS);
          },
        );
      });
    }

    if (apps === Apps.EIDAS) {
      console.log('Generate CSV file for eidas-bridge.');
      await GenerateCountry.generateCsvForEidasBridge(countryFile);
      return;
    }

    console.log('Generate CSV file for fc-apps.');
    await GenerateCountry.generateCsvForFcapps(countryFile);
  }

  static async generateCsvForFcapps(countryFile): Promise<void> {
    try {
      const searchResultFile: InseeDbCountryCurrentInterface[] =
        await readCSV(countryFile);
      const data: SearchDbCountryInterface[] = searchResultFile.map(
        ({
          COG: cog,
          CAPAY: oldGeographicCode,
          CRPAY: geographicCode,
          LIBCOG: name,
          ANCNOM: oldName,
        }) => ({
          cog,
          oldGeographicCode,
          geographicCode,
          name: replaceAllOccurrences(name, FIND_OCCURENCES, REPLACE_BY_SPACE),
          oldName: replaceAllOccurrences(
            oldName,
            FIND_OCCURENCES,
            REPLACE_BY_SPACE,
          ),
        }),
      );

      saveCsvToFile(data, Folder.TARGET_DIRECTORY_FOR_FCAPPS);
    } catch (err) {
      console.log('Error:', err);
    }
  }

  static async generateCsvForEidasBridge(countryFile): Promise<void> {
    try {
      const searchResultFile: InseeDbCountryCurrentInterface[] =
        await readCSV(countryFile);

      const data: SearchDbCountryInterface[] = searchResultFile
        .map(({ COG, CRPAY, LIBCOG, CODEISO2 }) => ({
          COG,
          LIBCOG,
          CODEISO2: ReplaceEmptyIsoCode(CODEISO2, CRPAY, searchResultFile),
        }))
        .filter((item) => item.CODEISO2 !== undefined);

      saveCsvToFile(data, Folder.TARGET_DIRECTORY_FOR_EIDAS);
    } catch (err) {
      console.log('Error:', err);
    }
  }
}

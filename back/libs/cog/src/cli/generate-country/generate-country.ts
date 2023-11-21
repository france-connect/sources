import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { FIND_OCCURENCES, REPLACE_BY_SPACE } from '../constants';
import { FilesName, Folder } from '../enums';
import {
  createCSV,
  getCwdForDirectory,
  readCSV,
  replaceAllOccurrences,
} from '../helpers';
import { SearchDbCountryInterface } from '../interface';
import { InseeDbCountryCurrentInterface } from '../interface/insee-db-country-current.interface';

export class GenerateCountry {
  static async run([countryFile]: [string?]): Promise<void> {
    if (!countryFile) {
      console.log('Please provide the path to the CSV file as an argument.');
    } else {
      await GenerateCountry.searchInCSVFiles(countryFile);
    }
  }

  static async searchInCSVFiles(countryFile): Promise<void> {
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

      const targetDirectory = getCwdForDirectory(Folder.TARGET_DIRECTORY);
      const filenameCsv = FilesName.COUNTRY;
      const fileContent = createCSV(data);

      if (!existsSync(targetDirectory)) {
        mkdirSync(targetDirectory, { recursive: true });
        console.log(`Directory "${targetDirectory}" has been created`);
      }

      const filePath = join(targetDirectory, filenameCsv);

      writeFileSync(filePath, fileContent);
      console.log(`${filenameCsv} was created with success into ${filePath}`);
    } catch (err) {
      console.log('Error:', err);
    }
  }
}

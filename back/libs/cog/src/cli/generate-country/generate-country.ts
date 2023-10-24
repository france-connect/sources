import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { FilesName, Folder } from '../enums';
import {
  createCSV,
  getCwdForDirectory,
  getParameterValue,
  readCSV,
} from '../helpers';

export class GenerateCountry {
  static async run(args): Promise<void> {
    const csv1 = getParameterValue(args, 0);

    if (!csv1) {
      console.log('Please provide the path to the CSV file as an argument.');
    } else {
      await GenerateCountry.searchInCSVFiles(csv1);
    }
  }

  static async searchInCSVFiles(file1): Promise<void> {
    try {
      const searchResultFile = await readCSV(file1);
      const data = searchResultFile.map(
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
          name,
          oldName,
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

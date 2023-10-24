import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { FilesName, Folder } from '../enums';
import {
  createCSV,
  getCwdForDirectory,
  getParameterValue,
  readCSV,
} from '../helpers';
import { InseeDbCityInterface } from '../interface';

const MATCHING_COLUMN = '#Code_commune_INSEE';

export class GenerateCity {
  static async run(args): Promise<void> {
    const csv1 = getParameterValue(args, 0);
    const csv2 = getParameterValue(args, 1);

    if (!csv1) {
      console.log(
        'Please provide the path to the 1st CSV file as an argument.',
      );
    } else if (!csv2) {
      console.log(
        'Please provide the path to the 2nd CSV file as an argument.',
      );
    } else {
      await GenerateCity.searchInTwoCSVFiles(csv1, csv2);
    }
  }

  static async searchInTwoCSVFiles(file1, file2): Promise<void> {
    try {
      const searchResultFile1 = await readCSV(file1);
      const searchResultFile2 = await readCSV(file2);

      const data = [];
      console.log(
        `Matching values between ${file1} and ${file2} on ${MATCHING_COLUMN}`,
      );

      data.push(
        ...searchResultFile1
          .filter(({ TYPECOM }) => TYPECOM !== 'COMD') // filter on the field 'COMD' because more specific place present in the "La Poste" file
          .flatMap((item) =>
            GenerateCity.processCSVData(
              item,
              searchResultFile2,
              MATCHING_COLUMN,
            ),
          ),
      );

      const targetDirectory = getCwdForDirectory(Folder.TARGET_DIRECTORY);
      const filenameCsv = FilesName.CITY;
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

  static processCSVData(
    searchResultFile1,
    searchResultFile2,
    matchColumn,
  ): InseeDbCityInterface[] | [] {
    const { COM: cog, NCC: name, ARR: arr } = searchResultFile1;
    const data = searchResultFile2
      .filter((item) => item[matchColumn] === cog)
      .map(
        ({
          Nom_de_la_commune: abr,
          Code_postal: cp,
          Ligne_5: specificPlace,
        }) => ({
          cog,
          name,
          arr,
          abr,
          cp,
          specificPlace,
        }),
      );

    return data;
  }
}

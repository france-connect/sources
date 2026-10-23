import { readFileSync } from 'fs';
import { join } from 'path';

import { CogService } from '@fc/cog';
import { FilesName, Folder } from '@fc/cog/cli/enums';
import { CityDto } from '@fc/cog/dto';
import { CityInterface } from '@fc/cog/interfaces';
import { CsvService } from '@fc/csv/services';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { ResolutionContextInterface } from '../interfaces';
import { InseeResolver } from './insee.resolver';

describe('InseeResolver with the extended INSEE dataset', () => {
  const path = join(
    __dirname,
    '../../../../..',
    Folder.TARGET_DIRECTORY_FOR_EIDAS,
    FilesName.EXTENDED_CITY,
  );
  const logger = getLoggerMock() as unknown as LoggerService;
  const csv = new CsvService<CityInterface>(logger, CityDto);
  const cog = new CogService(null, csv, null, null);
  const resolver = new InseeResolver(cog);

  beforeAll(async () => {
    await csv.parse(path);
    csv.createIndex('com');
  }, 30000);

  it('should load every row of the file without a DTO warning', () => {
    // Given
    const [, ...rows] = readFileSync(path, 'utf8').trim().split('\n');
    // When / Then
    expect(logger.warning).not.toHaveBeenCalled();
    expect(csv.filter({})).toHaveLength(rows.length);
  });

  it.each([
    ['La Chapelle-Achard', '85152'],
    ['Montplaisant', '24293'],
    ['Bazeilles', '08053'],
    ['Cœuvres-et-Valsery', '02201'],
    ['Paris 1er Arrondissement', '75056'],
    ['Acoua', '97601'],
    ['Papeete', '98735'],
    ['La Foa', '98813'],
    ['Clipperton', '98901'],
    ['Saint-Pierre', ''],
    ['Hargicourt', ''],
    ['Fontenay-aux-Roses', '92032'],
    ['Le Fresne-sur-Loire', '49160'],
  ])('should resolve %s to "%s"', (locality, expected) => {
    // Given
    const context: ResolutionContextInterface = {
      result: { birthcountry: '99100', birthplace: '' },
    };
    // When
    resolver.frenchCity({ country: 'FR', locality }, context);
    // Then
    expect(context.result.birthplace).toBe(expected);
  });

  it('should filter homonyms by department', () => {
    // When
    const cities = cog.getCitiesByNcc('SAINT PIERRE', '975');
    // Then
    expect(cities.map(({ com }) => com)).toEqual(['97502']);
  });

  it('should retain the current label when historical names share its COG', () => {
    // When / Then
    expect(cog.getLabelFromCog('85152')).toBe(
      'Les Achards - 85152, FRANCE (FR)',
    );
    expect(cog.getLabelFromCog('98901')).toBe(
      'La Passion-Clipperton - 98901, FRANCE (FR)',
    );
  });
});

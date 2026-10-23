import { accessSync, writeFileSync } from 'fs';
import { join } from 'path';

import { generateCSVContent, parseCsv } from '@fc/csv';

import { FilesName, Folder } from '../enums';
import { getCwdForDirectory } from '../helpers';
import {
  InseeDbCityComerInterface,
  InseeDbCityCurrentInterface,
  InseeDbCityExtendedInterface,
  InseeDbCityMovementInterface,
  InseeDbCityOverseasSince1943Interface,
} from '../interface';

type CityRow = Omit<InseeDbCityExtendedInterface, 'LAST_COMPARENT'>;
type CurrentCity = Pick<InseeDbCityCurrentInterface, keyof CityRow>;
type ComerCity = Pick<
  InseeDbCityComerInterface,
  'COM_COMER' | 'NCC' | 'LIBELLE' | 'COMER'
>;

/**
 * @NOTE Only the columns read by the generator are required, so that
 * unrelated INSEE format changes do not break the annual update.
 */
const CURRENT_COLUMNS: (keyof CurrentCity)[] = [
  'TYPECOM',
  'COM',
  'DEP',
  'NCC',
  'LIBELLE',
  'COMPARENT',
];
const MOVEMENT_COLUMNS: (keyof InseeDbCityMovementInterface)[] = [
  'DATE_EFF',
  'TYPECOM_AV',
  'COM_AV',
  'NCC_AV',
  'LIBELLE_AV',
  'TYPECOM_AP',
  'COM_AP',
];
const COMER_COLUMNS: (keyof ComerCity)[] = [
  'COM_COMER',
  'NCC',
  'LIBELLE',
  'COMER',
];
const OVERSEAS_HISTORY_COLUMNS: (keyof InseeDbCityOverseasSince1943Interface)[] =
  ['COM_COMER', 'NCC', 'LIBELLE'];

/**
 * @NOTE Our own tie-break between movements sharing a date, not INSEE codes.
 * Each weight outranks the sum of the lower ones.
 */
const CURRENT_DESTINATION_WEIGHT = 4;
const COMMUNE_DESTINATION_WEIGHT = 2;
const CODE_CHANGE_WEIGHT = 1;

export class GenerateExtendedCity {
  async run(args: string[]): Promise<void> {
    if (![4, 5].includes(args.length) || args.some((arg) => !arg)) {
      throw new Error(
        'Expected: current communes CSV, movements CSV, COMER CSV, overseas history CSV, [output CSV]',
      );
    }

    const [
      currentPath,
      movementsPath,
      comerPath,
      overseasHistoryPath,
      outputPath = join(
        getCwdForDirectory(Folder.TARGET_DIRECTORY_FOR_EIDAS),
        FilesName.EXTENDED_CITY,
      ),
    ] = args;
    const current = await this.read<CurrentCity>(currentPath, CURRENT_COLUMNS);
    const movements = await this.read<InseeDbCityMovementInterface>(
      movementsPath,
      MOVEMENT_COLUMNS,
    );
    const comer = await this.read<ComerCity>(comerPath, COMER_COLUMNS);
    const overseasHistory =
      await this.read<InseeDbCityOverseasSince1943Interface>(
        overseasHistoryPath,
        OVERSEAS_HISTORY_COLUMNS,
      );

    const rows = this.consolidate(current, movements, comer, overseasHistory);
    writeFileSync(outputPath, generateCSVContent(rows), 'utf8');
    console.log(`${rows.length} rows written to ${outputPath}`);
  }

  private async read<T>(path: string, columns: string[]): Promise<T[]> {
    accessSync(path);
    const rows = await parseCsv(path, {
      headers: true,
      ignoreEmpty: true,
      trim: true,
    });
    if (!rows.length || columns.some((column) => !(column in rows[0]))) {
      throw new Error(`Empty file or missing INSEE columns: ${path}`);
    }
    return rows as T[];
  }

  private consolidate(
    current: CurrentCity[],
    movements: InseeDbCityMovementInterface[],
    comer: ComerCity[],
    overseasHistory: InseeDbCityOverseasSince1943Interface[],
  ): InseeDbCityExtendedInterface[] {
    const currentCodes = new Set(current.map(({ COM }) => COM));
    const sorted = movements
      .filter(({ COM_AV }) => COM_AV)
      .sort(
        (left, right) =>
          right.DATE_EFF.localeCompare(left.DATE_EFF) ||
          this.rank(right, currentCodes) - this.rank(left, currentCodes) ||
          left.COM_AP.localeCompare(right.COM_AP),
      );
    const latest = this.latestMovements(sorted);

    const overseas = comer.map((row) => this.overseasRow(row));
    const pairs = new Set(
      [...current, ...overseas].map(({ COM, NCC }) => `${COM}:${NCC}`),
    );
    const history: CityRow[] = [];
    const historicalMovements = sorted.filter(
      ({ COM_AV }) => latest.get(COM_AV).COM_AP,
    );
    for (const movement of historicalMovements) {
      const key = `${movement.COM_AV}:${movement.NCC_AV}`;
      if (pairs.has(key)) {
        continue;
      }
      pairs.add(key);
      history.push(this.historicalRow(movement, currentCodes, latest));
    }

    const communes = current
      .map(({ TYPECOM, COM, DEP, NCC, LIBELLE, COMPARENT }) => ({
        TYPECOM,
        COM,
        DEP: DEP || this.departmentFromCog(COM),
        NCC,
        LIBELLE,
        COMPARENT,
      }))
      .sort(
        (left, right) =>
          Number(left.TYPECOM === 'COM') - Number(right.TYPECOM === 'COM'),
      );
    const aliases = this.overseasAliases(
      [...overseas, ...communes],
      overseasHistory,
      pairs,
    );
    /**
     * @NOTE The com index keeps the last row: current COM labels must win
     * over historical aliases and delegated communes sharing their code.
     */
    return this.withFinalParents(
      [...history, ...aliases, ...overseas, ...communes],
      [...overseas, ...communes],
    );
  }

  private withFinalParents(
    rows: CityRow[],
    current: CityRow[],
  ): InseeDbCityExtendedInterface[] {
    const byCode = new Map(current.map((row) => [row.COM, row]));
    return rows.map((row) => ({
      ...row,
      LAST_COMPARENT: this.finalParent(
        byCode.has(row.COM) ? row.COM : row.COMPARENT,
        byCode,
      ),
    }));
  }

  private finalParent(code: string, current: Map<string, CityRow>): string {
    const visited = new Set<string>();
    let parentCode = code;
    while (!visited.has(parentCode)) {
      const commune = current.get(parentCode);
      if (!commune) {
        throw new Error(`Unknown parent ${parentCode} for COG ${code}`);
      }
      if (commune.TYPECOM === 'COM') {
        return parentCode;
      }
      visited.add(parentCode);
      parentCode = commune.COMPARENT;
    }
    throw new Error(`Cyclic current parents for COG ${code}`);
  }

  private overseasAliases(
    current: CityRow[],
    history: InseeDbCityOverseasSince1943Interface[],
    pairs: Set<string>,
  ): CityRow[] {
    const overseas = new Map(
      current
        .filter(({ COM }) => /^(97|98)/.test(COM))
        .map((row) => [row.COM, row]),
    );
    const aliases: CityRow[] = [];
    for (const row of history) {
      const commune = overseas.get(row.COM_COMER);
      const key = `${row.COM_COMER}:${row.NCC}`;
      if (!commune || pairs.has(key)) {
        continue;
      }
      pairs.add(key);
      aliases.push({
        ...commune,
        NCC: row.NCC,
        LIBELLE: row.LIBELLE,
        COMPARENT: commune.COM,
      });
    }
    return aliases;
  }

  private latestMovements(
    sorted: InseeDbCityMovementInterface[],
  ): Map<string, InseeDbCityMovementInterface> {
    const latest = new Map<string, InseeDbCityMovementInterface>();
    for (const movement of sorted) {
      if (!latest.has(movement.COM_AV)) {
        latest.set(movement.COM_AV, movement);
      }
    }

    return latest;
  }

  private rank(
    movement: InseeDbCityMovementInterface,
    currentCodes: Set<string>,
  ): number {
    const current = currentCodes.has(movement.COM_AP)
      ? CURRENT_DESTINATION_WEIGHT
      : 0;
    const commune =
      movement.TYPECOM_AP === 'COM' ? COMMUNE_DESTINATION_WEIGHT : 0;
    const different =
      movement.COM_AP !== movement.COM_AV ? CODE_CHANGE_WEIGHT : 0;
    return current + commune + different;
  }

  private parent(
    code: string,
    currentCodes: Set<string>,
    latest: Map<string, InseeDbCityMovementInterface>,
  ): string {
    const visited = new Set<string>();
    let parentCode = code;
    while (!currentCodes.has(parentCode)) {
      if (visited.has(parentCode) || !latest.has(parentCode)) {
        throw new Error(
          `Cannot resolve historical COG ${code} to a current commune`,
        );
      }
      visited.add(parentCode);
      parentCode = latest.get(parentCode).COM_AP;
    }
    return parentCode;
  }

  private historicalRow(
    movement: InseeDbCityMovementInterface,
    currentCodes: Set<string>,
    latest: Map<string, InseeDbCityMovementInterface>,
  ): CityRow {
    const code = movement.COM_AV;
    return {
      TYPECOM: movement.TYPECOM_AV,
      COM: code,
      DEP: this.departmentFromCog(code),
      NCC: movement.NCC_AV,
      LIBELLE: movement.LIBELLE_AV,
      COMPARENT: this.parent(code, currentCodes, latest),
    };
  }

  private departmentFromCog(code: string): string {
    return code.startsWith('97') || code.startsWith('98')
      ? code.slice(0, 3)
      : code.slice(0, 2);
  }

  private overseasRow(row: ComerCity): CityRow {
    return {
      TYPECOM: 'COM',
      COM: row.COM_COMER,
      DEP: row.COMER,
      NCC: row.NCC,
      LIBELLE: row.LIBELLE,
      COMPARENT: '',
    };
  }
}

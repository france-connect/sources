import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

import { omit } from 'lodash';
import { tmpdir } from 'os';

import { generateCSVContent, parseCsv } from '@fc/csv';

import { Folder } from '../enums';
import { getCwdForDirectory } from '../helpers';
import { GenerateExtendedCity } from './generate-extended-city';

jest.mock('../helpers');

describe('GenerateExtendedCity', () => {
  const generator = new GenerateExtendedCity();
  const current = {
    TYPECOM: 'COM',
    COM: '01003',
    REG: '84',
    DEP: '01',
    CTCD: '',
    ARR: '',
    TNCC: '0',
    NCC: 'CURRENT',
    NCCENR: 'Current',
    LIBELLE: 'Current',
    CAN: '',
    COMPARENT: '',
  };
  const movement = {
    DATE_EFF: '2025-01-01',
    TYPECOM_AV: 'COM',
    COM_AV: '01001',
    TNCC_AV: '0',
    NCC_AV: 'FORMER',
    NCCENR_AV: 'Former',
    LIBELLE_AV: 'Former',
    TYPECOM_AP: 'COM',
    COM_AP: '01003',
  };
  const overseas = {
    COM_COMER: '98735',
    TNCC: '0',
    NCC: 'PAPEETE',
    NCCENR: 'Papeete',
    LIBELLE: 'Papeete',
    NATURE_ZONAGE: 'COM',
    COMER: '987',
    LIBELLE_COMER: 'Polynésie française',
  };
  const overseasHistory = {
    NATURE_ZONAGE: overseas.NATURE_ZONAGE,
    COM_COMER: overseas.COM_COMER,
    TNCC: overseas.TNCC,
    NCC: overseas.NCC,
    NCCENR: overseas.NCCENR,
    LIBELLE: overseas.LIBELLE,
    DATE_DEBUT: '1972-05-21',
    DATE_FIN: '',
  };
  let directory: string;
  let args: string[];

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'extended-cog-'));
    args = [
      'current.csv',
      'movements.csv',
      'comer.csv',
      'overseas-history.csv',
      'output.csv',
    ].map((name) => join(directory, name));
    writeFileSync(args[0], generateCSVContent([current]));
    writeFileSync(args[1], generateCSVContent([movement]));
    writeFileSync(args[2], generateCSVContent([overseas]));
    writeFileSync(args[3], generateCSVContent([overseasHistory]));
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    rmSync(directory, { recursive: true, force: true });
  });

  it('should keep old COGs, map COMER and place current labels last', async () => {
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({
      COM: '01001',
      DEP: '01',
      NCC: 'FORMER',
      COMPARENT: '01003',
      LAST_COMPARENT: '01003',
    });
    expect(rows[1]).toMatchObject({
      COM: '98735',
      DEP: '987',
      NCC: 'PAPEETE',
      TYPECOM: 'COM',
      LAST_COMPARENT: '98735',
    });
    expect(rows[2]).toEqual({
      TYPECOM: current.TYPECOM,
      COM: current.COM,
      DEP: current.DEP,
      NCC: current.NCC,
      LIBELLE: current.LIBELLE,
      COMPARENT: current.COMPARENT,
      LAST_COMPARENT: current.COM,
    });
  });

  it('should only require the INSEE columns it reads', async () => {
    // Given
    const used = omit(current, ['REG', 'CTCD', 'ARR', 'TNCC', 'NCCENR', 'CAN']);
    writeFileSync(args[0], generateCSVContent([used]));
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(rows).toHaveLength(3);
  });

  it('should write the eIDAS dataset by default', async () => {
    // Given
    jest.mocked(getCwdForDirectory).mockReturnValue(directory);
    // When
    await generator.run(args.slice(0, 4));
    // Then
    expect(getCwdForDirectory).toHaveBeenCalledExactlyOnceWith(
      Folder.TARGET_DIRECTORY_FOR_EIDAS,
    );
    const rows = await parseCsv(join(directory, 'communes-extended-cog.csv'), {
      headers: true,
    });
    expect(rows).toHaveLength(3);
  });

  it('should keep every former name once, including names of a current COG', async () => {
    // Given
    const alias = { ...movement, COM_AV: current.COM };
    const earlier = { ...alias, DATE_EFF: '1990-01-01', NCC_AV: 'EARLIER' };
    writeFileSync(
      args[1],
      generateCSVContent([
        alias,
        alias,
        earlier,
        { ...alias, NCC_AV: current.NCC },
      ]),
    );
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(
      rows.filter(({ COM }) => COM === current.COM).map(({ NCC }) => NCC),
    ).toEqual(['FORMER', 'EARLIER', 'CURRENT']);
  });

  it('should prefer a current COM when movements share a date, regardless of input order', async () => {
    // Given
    const delegated = {
      ...movement,
      TYPECOM_AP: 'COMD',
      COM_AP: movement.COM_AV,
    };
    writeFileSync(args[1], generateCSVContent([delegated, movement]));
    // When
    await generator.run(args);
    const first = readFileSync(args[4], 'utf8');
    writeFileSync(args[1], generateCSVContent([movement, delegated]));
    await generator.run(args);
    // Then
    expect(readFileSync(args[4], 'utf8')).toBe(first);
    const rows = await parseCsv(args[4], { headers: true });
    expect(rows[0].COMPARENT).toBe(current.COM);
  });

  it('should follow the latest movements through more than one disappeared COG', async () => {
    // Given
    const old = { ...movement, DATE_EFF: '1980-01-01', COM_AP: '09999' };
    const intermediate = { ...movement, COM_AP: '01002' };
    const final = { ...movement, COM_AV: '01002', NCC_AV: 'INTERMEDIATE' };
    writeFileSync(args[1], generateCSVContent([old, intermediate, final]));
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(rows.find(({ COM }) => COM === '01001').COMPARENT).toBe('01003');
  });

  it.each(['14513', '97123', '98801', '2A001', '20001'])(
    'should keep the original department for historical COG %s',
    async (code) => {
      // Given
      writeFileSync(
        args[1],
        generateCSVContent([{ ...movement, COM_AV: code }]),
      );
      // When
      await generator.run(args);
      const rows = await parseCsv(args[4], { headers: true });
      // Then
      expect(rows[0].DEP).toBe(
        code.startsWith('9') ? code.slice(0, 3) : code.slice(0, 2),
      );
      expect(rows[0].COMPARENT).toBe('01003');
    },
  );

  it.each(['01001', '09999'])(
    'should reject a cycle or unresolved parent %s without replacing the output',
    async (parent) => {
      // Given
      writeFileSync(
        args[1],
        generateCSVContent([{ ...movement, COM_AP: parent }]),
      );
      writeFileSync(args[4], 'previous dataset');
      // When / Then
      await expect(generator.run(args)).rejects.toThrow(
        'Cannot resolve historical COG',
      );
      expect(readFileSync(args[4], 'utf8')).toBe('previous dataset');
    },
  );

  it('should ignore creations without a former COG', async () => {
    // Given
    const creation = { ...movement, COM_AV: '', NCC_AV: '', LIBELLE_AV: '' };
    writeFileSync(args[1], generateCSVContent([creation, movement]));
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(rows).toHaveLength(3);
    expect(rows.every(({ COM }) => Boolean(COM))).toBe(true);
  });

  it('should fill a delegated commune department from its original COG', async () => {
    // Given
    const delegated = {
      ...current,
      TYPECOM: 'COMD',
      COM: '14513',
      DEP: '',
      COMPARENT: current.COM,
    };
    writeFileSync(args[0], generateCSVContent([current, delegated]));
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(rows.find(({ COM }) => COM === delegated.COM).DEP).toBe('14');
  });

  it('should exclude a COG whose final deletion has no destination', async () => {
    // Given
    const old = { ...movement, DATE_EFF: '2000-01-01' };
    const deletion = { ...movement, COM_AP: '', TYPECOM_AP: '' };
    writeFileSync(args[1], generateCSVContent([old, deletion]));
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(rows.map(({ COM }) => COM)).toEqual(['98735', current.COM]);
  });

  it('should reject missing arguments', async () => {
    // When / Then
    await expect(generator.run([])).rejects.toThrow('Expected:');
  });

  it('should follow historical movements and current delegated parents to the final COM', async () => {
    // Given
    const delegated = {
      ...current,
      COM: '01002',
      TYPECOM: 'COMD',
      COMPARENT: current.COM,
    };
    writeFileSync(args[0], generateCSVContent([current, delegated]));
    writeFileSync(
      args[1],
      generateCSVContent([{ ...movement, COM_AP: delegated.COM }]),
    );
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(rows.find(({ COM }) => COM === movement.COM_AV)).toMatchObject({
      COMPARENT: delegated.COM,
      LAST_COMPARENT: current.COM,
    });
    expect(rows.find(({ COM }) => COM === delegated.COM)).toMatchObject({
      COMPARENT: current.COM,
      LAST_COMPARENT: current.COM,
    });
  });

  it('should prefer the current COM over a delegated row sharing its code regardless of order', async () => {
    // Given
    const delegated = {
      ...current,
      TYPECOM: 'COMD',
      NCC: 'FORMER CHIEF TOWN',
      LIBELLE: 'Former chief town',
      COMPARENT: current.COM,
    };
    writeFileSync(args[0], generateCSVContent([current, delegated]));
    // When
    await generator.run(args);
    const first = readFileSync(args[4], 'utf8');
    writeFileSync(args[0], generateCSVContent([delegated, current]));
    await generator.run(args);
    // Then
    expect(readFileSync(args[4], 'utf8')).toBe(first);
    const rows = await parseCsv(args[4], { headers: true });
    expect(rows.at(-1)).toMatchObject({
      TYPECOM: 'COM',
      LIBELLE: current.LIBELLE,
      LAST_COMPARENT: current.COM,
    });
  });

  it('should follow the current parent when a historical alias still has a delegated COG', async () => {
    // Given
    const delegated = {
      ...current,
      COM: movement.COM_AV,
      TYPECOM: 'COMD',
      NCC: 'RENAMED DELEGATED COMMUNE',
      COMPARENT: current.COM,
    };
    writeFileSync(args[0], generateCSVContent([delegated, current]));
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(rows.find(({ NCC }) => NCC === movement.NCC_AV)).toMatchObject({
      COM: delegated.COM,
      COMPARENT: delegated.COM,
      LAST_COMPARENT: current.COM,
    });
  });

  it('should record an arrondissement final parent without replacing its own COG', async () => {
    // Given
    const arrondissement = {
      ...current,
      COM: '75101',
      TYPECOM: 'ARM',
      COMPARENT: current.COM,
    };
    writeFileSync(args[0], generateCSVContent([current, arrondissement]));
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(rows.find(({ TYPECOM }) => TYPECOM === 'ARM')).toMatchObject({
      COM: '75101',
      LAST_COMPARENT: current.COM,
    });
  });

  it.each(['', '09999'])(
    'should reject an unknown current parent "%s" without overwriting the output',
    async (parent) => {
      // Given
      const delegated = {
        ...current,
        TYPECOM: 'COMD',
        COM: '01002',
        COMPARENT: parent,
      };
      writeFileSync(args[0], generateCSVContent([current, delegated]));
      writeFileSync(args[4], 'previous dataset');
      // When / Then
      await expect(generator.run(args)).rejects.toThrow('Unknown parent');
      expect(readFileSync(args[4], 'utf8')).toBe('previous dataset');
    },
  );

  it.each(['01002', '01004'])(
    'should reject a current parent cycle through %s without overwriting the output',
    async (parent) => {
      // Given
      const delegated = {
        ...current,
        TYPECOM: 'COMD',
        COM: '01002',
        COMPARENT: parent,
      };
      const other = { ...delegated, COM: '01004', COMPARENT: '01002' };
      writeFileSync(args[0], generateCSVContent([current, delegated, other]));
      writeFileSync(args[4], 'previous dataset');
      // When / Then
      await expect(generator.run(args)).rejects.toThrow(
        'Cyclic current parents',
      );
      expect(readFileSync(args[4], 'utf8')).toBe('previous dataset');
    },
  );

  it('should add an overseas former name once and preserve the current label last', async () => {
    // Given
    const former = {
      ...overseasHistory,
      NCC: 'FORMER OVERSEAS',
      NCCENR: 'Former overseas',
      LIBELLE: 'Former overseas',
      DATE_FIN: '2022-02-21',
    };
    writeFileSync(
      args[3],
      generateCSVContent([former, former, overseasHistory]),
    );
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    const matches = rows.filter(({ COM }) => COM === overseas.COM_COMER);
    expect(matches).toHaveLength(2);
    expect(matches[0]).toMatchObject({
      NCC: former.NCC,
      LIBELLE: former.LIBELLE,
      DEP: overseas.COMER,
      COMPARENT: overseas.COM_COMER,
    });
    expect(matches[1].NCC).toBe(overseas.NCC);
  });

  it('should keep aliases for a former overseas commune now in a DOM', async () => {
    // Given
    const dom = { ...current, COM: '97601', DEP: '976', NCC: 'CURRENT DOM' };
    writeFileSync(args[0], generateCSVContent([current, dom]));
    writeFileSync(
      args[3],
      generateCSVContent([
        { ...overseasHistory, COM_COMER: dom.COM, NCC: 'FORMER DOM' },
      ]),
    );
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(rows.find(({ NCC }) => NCC === 'FORMER DOM')).toMatchObject({
      COM: '97601',
      DEP: '976',
      COMPARENT: '97601',
    });
  });

  it('should not duplicate an overseas alias already supplied by general movements', async () => {
    // Given
    const dom = { ...current, COM: '97601', DEP: '976', NCC: 'CURRENT DOM' };
    writeFileSync(args[0], generateCSVContent([current, dom]));
    writeFileSync(
      args[1],
      generateCSVContent([{ ...movement, COM_AV: dom.COM, COM_AP: dom.COM }]),
    );
    writeFileSync(
      args[3],
      generateCSVContent([
        { ...overseasHistory, COM_COMER: dom.COM, NCC: movement.NCC_AV },
      ]),
    );
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(rows.filter(({ COM }) => COM === dom.COM)).toHaveLength(2);
  });

  it('should exclude disappeared overseas codes and former foreign places reusing a metropolitan code', async () => {
    // Given
    writeFileSync(
      args[3],
      generateCSVContent([
        { ...overseasHistory, COM_COMER: '98501' },
        { ...overseasHistory, COM_COMER: current.COM, NCC: 'FOREIGN PLACE' },
      ]),
    );
    // When
    await generator.run(args);
    const rows = await parseCsv(args[4], { headers: true });
    // Then
    expect(rows).toHaveLength(3);
    expect(rows.some(({ COM }) => COM === '98501')).toBe(false);
    expect(rows.some(({ NCC }) => NCC === 'FOREIGN PLACE')).toBe(false);
  });

  it('should reject a movement file supplied instead of overseas history without replacing the output', async () => {
    // Given
    writeFileSync(args[3], generateCSVContent([movement]));
    writeFileSync(args[4], 'previous dataset');
    // When / Then
    await expect(generator.run(args)).rejects.toThrow(
      'Empty file or missing INSEE columns',
    );
    expect(readFileSync(args[4], 'utf8')).toBe('previous dataset');
  });

  it.each(['', 'WRONG_HEADER\nwrong value'])(
    'should reject empty files or missing columns',
    async (content) => {
      // Given
      writeFileSync(args[0], content);
      // When / Then
      await expect(generator.run(args)).rejects.toThrow(
        'Empty file or missing INSEE columns',
      );
    },
  );

  it('should reject a missing source file', async () => {
    // Given
    args[0] = join(directory, 'missing.csv');
    // When / Then
    await expect(generator.run(args)).rejects.toThrow();
  });
});

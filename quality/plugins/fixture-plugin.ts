import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_FIXTURE_PATH = './cypress/fixtures';

interface getFixturePathArgs {
  fixture: string;
  fixtureDir?: string;
  pathArray: string[];
}

/**
 * Retrieve the Fixture path or undefined if not found
 */
export const getFixturePath = (args: getFixturePathArgs): string => {
  const { fixture, fixtureDir = DEFAULT_FIXTURE_PATH, pathArray } = args;
  const pathFound = pathArray
    .map((_, index, array) => array.slice(0, -index || array.length))
    .map((paths) => path.join(...paths, fixture))
    .find((fixturePath) => fs.existsSync(path.join(fixtureDir, fixturePath)));
  return pathFound;
};

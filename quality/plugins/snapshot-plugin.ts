import path from 'path';

import { SnapshotState, toMatchSnapshot } from 'jest-snapshot';

let snapshotFolderPath: string;

export const initSnapshotPlugin = (
  config: Cypress.PluginConfigOptions,
): void => {
  snapshotFolderPath = path.join(
    config.projectRoot,
    'cypress',
    'snapshots',
    'jest',
  );
};

const newSnapshotState = (snapshotFilePath: string): SnapshotState => {
  return new SnapshotState(snapshotFilePath, {
    expand: false,
    rootDir: snapshotFolderPath,
    snapshotFormat: {
      escapeString: false,
      printBasicPrototype: false,
    },
    updateSnapshot: 'new',
  });
};

// Plugin

interface MatchSnapshotArgsInterface {
  snapshotName: string;
  value: unknown;
}

export const matchSnapshot = ({
  snapshotName,
  value,
}: MatchSnapshotArgsInterface): null => {
  if (!snapshotFolderPath) {
    throw new Error(
      'SnapshotState not initialized. Call initSnapshotPlugin(config) first.',
    );
  }
  const snapshotNameWithoutSpaces = snapshotName.replace(/\s+/g, '_');
  const snapshotFilePath = path.join(
    snapshotFolderPath,
    `${snapshotNameWithoutSpaces}.snap`,
  );
  const snapshotState = newSnapshotState(snapshotFilePath);
  const context = { currentTestName: snapshotName, snapshotState };
  const result = toMatchSnapshot.call(context, value);
  snapshotState.save();
  if (!result.pass) {
    throw new Error(result.message());
  }
  return null;
};

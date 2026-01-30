import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { readdir, readFile, writeFile } = fs.promises;

/**
 * Resolve the directory containing this script file.
 * @returns {string} Absolute path of the current script directory.
 */
function getScriptDir() {
  const filename = fileURLToPath(import.meta.url);
  return path.dirname(filename);
}

/**
 * Retrieves all i18n translation files for a given language within a directory.
 * Only files named "<lang>.json" are returned.
 *
 * @param {string} dir - The directory path to search.
 * @param {string} lang - The language (e.g., "fr" or "en") to filter files.
 * @returns {Promise<string[]>} An array of full paths of matching i18n files.
 */
async function getAllI18nFiles(dir, lang) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && entry.name === `${lang}.json`)
      .map((entry) => path.join(dir, entry.name));
  } catch (err) {
    // Debug helper for the script
    // eslint-disable-next-line no-console
    console.error('Error reading files:', err);
    throw err;
  }
}

/**
 * Scans a root directory to find all subdirectories that contain an "src/i18n"
 * folder and returns all i18n files for a given language inside them.
 *
 * For each direct subdirectory of rootDir, this function checks:
 *   <rootDir>/<subdir>/src/i18n/<lang>.json
 *
 * @param {string} rootDir - The root directory path to explore.
 * @param {string} lang - The language of the i18n files to search for.
 * @returns {Promise<string[]>} An array of paths to all i18n files found.
 */
async function getAllI18nFolders(rootDir, lang) {
  try {
    const entries = await readdir(rootDir, { withFileTypes: true });

    const i18nDirs = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(rootDir, entry.name, 'src', 'i18n'))
      .filter((i18nDir) => fs.existsSync(i18nDir));

    const filesPerDir = await Promise.all(
      i18nDirs.map((i18nDir) => getAllI18nFiles(i18nDir, lang)),
    );

    return filesPerDir.flat();
  } catch (err) {
    // Debug helper for the script
    // eslint-disable-next-line no-console
    console.error('Error reading directories:', err);
    throw err;
  }
}

/**
 * Filters out any file paths that match one of the excluded patterns.
 * A file is excluded if its full path contains any of the provided substrings.
 *
 * @param {string[]} files - List of file paths to filter.
 * @param {string[]} [excluded=[]] - List of substrings; if a path contains one, it is removed.
 * @returns {string[]} Filtered list of file paths.
 */
function filterExcludedFiles(files, excluded = []) {
  if (!excluded || excluded.length === 0) {
    return files;
  }

  return files.filter((filepath) => !excluded.some((pattern) => filepath.includes(pattern)));
}

/**
 * Sequentially reads and merges JSON files into a single object.
 * Later files override keys from earlier ones when there is a conflict.
 *
 * @param {string[]} files - List of JSON file paths to merge.
 * @returns {Promise<object>} The merged translation object.
 */
async function mergeJsonFiles(files) {
  const merged = {};

  for (const file of files) {
    try {
      const content = await readFile(file, 'utf8');
      const parsed = JSON.parse(content);
      Object.assign(merged, parsed);
    } catch (err) {
      // Debug helper for the script
      // eslint-disable-next-line no-console
      console.error(`Error reading file ${file}:`, err);
    }
  }

  return merged;
}

/**
 * Reads and merges all i18n files from "libs", "apps", and a specific "instance"
 * for a given language. The final merged JSON is written to:
 *
 *   instances/<instanceName>/src/<lang>.i18n.json
 *
 * Merge order (later overrides earlier):
 *   1. libs/<libName>/src/i18n/<lang>.json
 *   2. apps/<appName>/src/i18n/<lang>.json
 *   3. instances/<instanceName>/src/i18n/<lang>.json
 *
 * @param {string} instanceName - The name of the instance.
 * @param {string} lang - The language of the i18n files to read (e.g., "fr" or "en").
 * @param {string[]} [excluded=[]] - Paths of libs or apps to exclude from the process.
 * @returns {Promise<void>}
 */
async function readI18nFiles(instanceName, lang, excluded = []) {
  try {
    const scriptDir = getScriptDir();
    const workspaceRoot = path.join(scriptDir, '..');

    const libsPath = path.join(workspaceRoot, 'libs');
    const appsPath = path.join(workspaceRoot, 'apps');
    const instanceI18nPath = path.join(workspaceRoot, 'instances', instanceName, 'src', 'i18n');

    // Discover all candidate files in libs, apps, and the instance itself.
    const [libsFiles, appsFiles, instanceFiles] = await Promise.all([
      getAllI18nFolders(libsPath, lang),
      getAllI18nFolders(appsPath, lang),
      getAllI18nFiles(instanceI18nPath, lang),
    ]);

    const allFiles = filterExcludedFiles([...libsFiles, ...appsFiles, ...instanceFiles], excluded);

    // Deterministic merge: libs → apps → instance (order of allFiles).
    const merged = await mergeJsonFiles(allFiles);

    const outputFile = path.join(
      workspaceRoot,
      'instances',
      instanceName,
      'src',
      `${lang}.i18n.json`,
    );
    const jsonContent = `${JSON.stringify(merged, null, 2)}\n`;

    await writeFile(outputFile, jsonContent);
    // Debug helper for the script
    // eslint-disable-next-line no-console
    console.log(`${instanceName} i18n file for ${lang} successfully written`);
  } catch (err) {
    // Debug helper for the script
    // eslint-disable-next-line no-console
    console.error('General error:', err);
  }
}

/**
 * CLI entry point.
 * Expected usage:
 *   node script.mjs <instanceName> [excludedPath1 excludedPath2 ...]
 */
async function main() {
  const [instanceName, ...excluded] = process.argv.slice(2);

  if (!instanceName) {
    throw new Error('❌ Missing argument');
  }

  const languages = ['fr'];

  await Promise.all(languages.map((lang) => readI18nFiles(instanceName, lang, excluded)));
}

// Top-level await is used here because this is an ES module.
await main();

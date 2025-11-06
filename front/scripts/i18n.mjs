import fs from 'fs';
import path from 'path';
import url from 'url';

/**
 * Retrieves all i18n translation files for a given language within a directory.
 * @param {string} dir - The directory path to search.
 * @param {string} lang - The language (e.g., 'fr' or 'en') to filter files.
 * @returns {Promise<string[]>} - An array of full paths of matching i18n files.
 */
async function getAllI18nFiles(dir, lang) {
  try {
    // Read the content of the directory
    const files = await fs.promises.readdir(dir, { withFileTypes: true });

    // Filter and return the file paths that match the language file
    return files
      .filter(file => file.isFile() && file.name === `${lang}.json`)
      .map(file => path.join(dir, file.name));
  } catch (err) {
    // @NOTE Debug du script
    // eslint-disable-next-line no-console
    console.error('Error reading files:', err);
    throw err;
  }
}

/**
 * Scans a directory to find all subdirectories containing i18n files for a given language.
 * @param {string} dir - The root directory path to explore.
 * @param {string} lang - The language of the i18n files to search for (e.g., 'fr' or 'en').
 * @returns {Promise<string[]>} - An array of paths to all i18n files found.
 */
async function getAllI18nFolders(dir, lang) {
  try {
    const folders = await fs.promises.readdir(dir, { withFileTypes: true });
    return await Promise.all(
      folders
      .filter(folder => folder.isDirectory())
      .map(async folder => {
        // Construct the path to the i18n directory
        // within the subdirectory structure
        const nextPath = path.join(dir, folder.name, 'src', 'i18n');
        const folderExists = fs.existsSync(nextPath);

        if (folderExists) { // Check if the i18n directory exists
          const files = await getAllI18nFiles(nextPath, lang);
          return files;
        }

        return null;
      })
    );
  } catch (err) {
    // @NOTE Debug du script
    // eslint-disable-next-line no-console
    console.error('Error reading directories:', err);
    throw err;
  }
}

/**
 * Reads and merges all i18n files from a specific instance with those from libs and apps.
 * The final file is then written to an output file in JSON format.
 * @param {string} name - The name of the instance.
 * @param {string} lang - The language of the i18n files to read (e.g., 'fr' or 'en').
 * @param {string} excluded - Paths of lib or apps to exclude from the process
 */
async function readI18nFiles(instanceName, lang, excluded) {
  try {
    const filename = url.fileURLToPath(import.meta.url);
    const dirname = path.dirname(filename);

    // Define paths for 'libs', 'apps', and 'instances' directories
    const libspath = path.join(dirname, '..', 'libs');
    const libsFiles = await getAllI18nFolders(libspath, lang);

    const appspath = path.join(dirname, '..', 'apps');
    const appsFiles = await getAllI18nFolders(appspath, lang);

    const instancePath = path.join(dirname, '..', 'instances', instanceName, 'src', 'i18n');
    const instanceFiles = await getAllI18nFiles(instancePath, lang);

    // Merge all found files into one array
    const allFiles = [...libsFiles, ...appsFiles, ...instanceFiles].flat().filter(v => v).filter(filepath => {
      const almostOne = excluded.some(p => filepath.includes(p))
      return !almostOne;
    });

    let merged = {};
    // Create a promise to read and merge the JSON files
    const fileReadPromises = allFiles.map(async (file) => {
      try {
        // Read the JSON file
        const content = await fs.promises.readFile(file, 'utf8');
        const object = JSON.parse(content); // Parse the content into JSON
        merged = { ...merged, ...object }; // Merge with other content
      } catch (err) {
        // @NOTE Debug du script
        // eslint-disable-next-line no-console
        console.error(`Error reading file ${file}:`, err);
      }
    });

    // Wait for all files to be read in parallel
    await Promise.all(fileReadPromises);

    // Define the output file path
    const outputFile = path.join(
      dirname,
      '..',
      'instances',
      instanceName,
      'src',
      `${lang}.i18n.json`
    );
    const jsonContent = JSON.stringify(merged, null, 2);

    // Write the merged JSON file
    await fs.promises.writeFile(outputFile, jsonContent);
    // @NOTE Debug du script
    // eslint-disable-next-line no-console
    console.log(`${instanceName} i18n file for ${lang} successfully written`);

  } catch (err) {
    // @NOTE Debug du script
    // eslint-disable-next-line no-console
    console.error('General error:', err);
  }
}

// Get the argument from the command line (instance name)
const arg = process.argv[2];
if (!arg) {
  // Handle missing required argument
  throw new Error('❌ Missing argument');
} else {
  // optionnal argument
  const excluded = process.argv.slice(3);
  // Start reading i18n files for languages
  await readI18nFiles(arg, 'fr', excluded);
}

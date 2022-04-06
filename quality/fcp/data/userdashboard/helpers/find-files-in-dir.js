const { existsSync, lstatSync, readdirSync } = require('fs');
const { join } = require('path');

/**
 * Find all files recursively in specific folder with specific extension, e.g:
 * findFilesInDir('./project/src', '.html') ==> ['./project/src/a.html','./project/src/build/index.html']
 * @param  {String} startPath    Path relative to this file or other file which requires this files
 * @param  {RegExp} filter       Extension name, e.g: '.html'
 * @return {Array}               Result files with path string in an array
 */
function findFilesInDir(startPath, regExp) {
  if (!existsSync(startPath)) {
    throw new Error(`Unknown directory at path : ${startPath}`);
  }

  const files = readdirSync(startPath)
    .map((file) => {
      const filename = join(startPath, file);
      const stat = lstatSync(filename);
      if (stat.isDirectory()) {
        const subFiles = findFilesInDir(filename, regExp);
        return subFiles;
      } else if (regExp.test(filename)) {
        return filename;
      }
    })
    .flat()
    .filter(Boolean);

  return files;
}

module.exports = findFilesInDir;

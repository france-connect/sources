/**
 * @SEE https://eslint.org/blog/2023/10/deprecating-formatting-rules/
 *
 * @USAGE There is no automated way to maintain the deprecation list up-to-date
 * - Search on google into ESLint official doc
 * - Update the deprecated.<timestamp>.json file
 * - Update the timestamp into deprecated.<timestamp>.json filename
 * - Update this script :shrug:
 */
const fs = require('fs');

// Charger le fichier JSON contenant les règles à comparer
const rulesDeprecated = require('./deprecated.20231026.json');
const rulesLegacy = require('../configs/legacy.js');

// Trouver les règles communes entre les deux fichiers
const commonRules = Object.keys(rulesLegacy.rules).filter((rule) => rulesDeprecated.includes(rule));

// Écrire les règles communes dans un nouveau fichier
fs.writeFileSync('./common-rules.tmp.txt', commonRules.join('\n'));

/* istanbul ignore file */

// Declarative code
import { GenerateCountry } from './generate-country';

const args = process.argv.slice(2);
void GenerateCountry.run(args);

/* istanbul ignore file */

// Declarative code
import { GenerateCountry } from './generate-country';

const args = process.argv.slice(2) as [string?];
void GenerateCountry.run(args);

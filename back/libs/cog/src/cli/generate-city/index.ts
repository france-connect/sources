/* istanbul ignore file */

// Declarative code
import { GenerateCity } from './generate-city';

const args = process.argv.slice(2);
void GenerateCity.run(args);

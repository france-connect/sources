/* istanbul ignore file */

// Declarative code
import { GenerateCity } from './generate-city';

const args = process.argv.slice(2) as [string?, string?, string?];
const instance = new GenerateCity();

void instance.run(args);

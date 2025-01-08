import { GenerateCountry } from './generate-country';

const args = process.argv.slice(2) as [string?, string?];
void GenerateCountry.run(args);

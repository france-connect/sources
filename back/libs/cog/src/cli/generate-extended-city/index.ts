import { GenerateExtendedCity } from './generate-extended-city';

const instance = new GenerateExtendedCity();

instance.run(process.argv.slice(2)).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

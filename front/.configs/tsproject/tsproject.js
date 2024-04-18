const fs = require('fs');
const path = require('path');

// 🚦 Get file argument from command line
const arg = process.argv[2];
if (!arg) {
  throw new Error(`❌ Missing file argument`);
}

// Get current working directory
const cwd = process.cwd();

// Read and parse JSON configuration file
const json = fs.readFileSync(path.resolve(cwd, arg));
const config = JSON.parse(json);

// ❌ Check for essential properties
if (!config.options) {
  throw new Error(`❌ Missing properties 'options' in ${arg} file`);
}
if (!config.projects) {
  throw new Error(`❌ Missing properties 'projects'`);
}
if (!config.projects.main) {
  throw new Error(`❌ Missing properties 'projects.main' in ${arg} file`);
}

Object.keys(config.projects).forEach((key) => {
  const { options, projects } = config;

  // 📄 Generate JSON content for tsconfig file
  const jsoncontent = JSON.stringify(
    {
      // @TODO how to read the source config (extends) ?
      extends: options.extends,
      compilerOptions: {
        // @TODO If not empty
        ...(options.compilerOptions || {}),
        ...(projects[key].compilerOptions || {}),
      },
      // @TODO add more options to extend
      include: [...(options.include || []), ...(projects[key].include || [])],
      exclude: [...(options.exclude || []), ...(projects[key].exclude || [])],
      files: [...(options.files || []), ...(projects[key].files || [])],
    },
    null,
    2,
  );

  const content = [
    '// ⚠⚠⚠ DO NOT MODIFY ⚠⚠⚠',
    '// tsconfig files should be generated using the tsproject <config file> command',
    jsoncontent,
  ].join('\n');

  // Define output filename
  const filename = key === 'main' ? 'tsconfig.json' : `tsconfig.${key}.json`;
  const outputFile = path.resolve(cwd, filename);

  // 💾 Write content to output file
  fs.writeFileSync(outputFile, content);

  // Log success message
  console.log(`✅ File generated: ${outputFile}`);
});

const path = require('path');
const {
  CracoAliasPlugin,
  configPaths,
} = require('react-app-rewire-alias/lib/aliasDangerous');

module.exports = {
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: { alias: configPaths(path.resolve('../../tsconfig.json')) },
    },
  ],
};

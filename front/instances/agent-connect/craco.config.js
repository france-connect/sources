const path = require('path');
const { CracoAliasPlugin, configPaths } = require('react-app-rewire-alias/lib/aliasDangerous');

module.exports = {
  plugins: [
    {
      options: {
        alias: configPaths(path.resolve('../../tsconfig.shared.json')),
      },
      plugin: CracoAliasPlugin,
    },
  ],
};

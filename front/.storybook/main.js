const path = require('path');

const tsConfig = require('../tsconfig.app.json');

function getPackageName(str) {
  const regex = /(@fc\/[\w-]*)/g;
  const [clean] = str.match(regex);
  return clean;
}

function removeTrailingStarsAndRelativePath(str) {
  const regex = /(\.{2}\/)|(\/?\*)/g;
  const clean = str.replace(regex, '');
  return clean;
}

function reduceAliases(acc, [from, to]) {
  const packageName = getPackageName(from);
  const packagePath = removeTrailingStarsAndRelativePath(to[0]);
  const resolvedPackagePath = path.resolve(__dirname, '..', packagePath);

  const reduced = { ...acc, [packageName]: resolvedPackagePath };
  return reduced;
}

module.exports = {
  stories: ['../@(apps|instances|libs)/**/*.stories.tsx'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    // Manage project aliases
    const { paths } = tsConfig.compilerOptions;
    const entries = Object.entries(paths);
    const tsConfigAliases = entries.reduce(reduceAliases, {});

    config.resolve.alias = {
      ...config.resolve.alias,
      ...tsConfigAliases,
    };

    config.module.rules.push({
      test: /(\.module)?\.(scss|sass)$/,
      use: ['style-loader', 'css-loader?modules&importLoaders', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    return config;
  },
};

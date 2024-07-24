// eslint-disable-next-line @typescript-eslint/no-var-requires
const { StatsWriterPlugin } = require('webpack-stats-plugin');

module.exports = {
  plugins: [
    /**
     * Export build informations to a file
     * Allows to analyse files actually used for each applications
     */
    new StatsWriterPlugin({
      filename: (compiler) => {
        // Dynamically retrieve build output path
        return compiler.options.output.filename.replace(
          'main.js',
          'stats.json',
        );
      },
      stats: {
        all: true,
      },
    }),
  ],
};

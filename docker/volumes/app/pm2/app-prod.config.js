const os = require("os");

module.exports = {
  apps: [
    {
      name: os.hostname(),
      script: `dist/instances/${process.env.NESTJS_INSTANCE}/main.js`,
      cwd: process.env.PM2_CWD,
      out_file:
        process.env.PM2_OUT_FILE ||
        `/var/log/app/${
          process.env.APP_NAME || process.env.VIRTUAL_HOST || os.hostname()
        }-out.log`,
      error_file:
        process.env.PM2_ERROR_FILE ||
        `/var/log/app/${
          process.env.APP_NAME || process.env.VIRTUAL_HOST || os.hostname()
        }-error.log`,
      exec_mode: "cluster",
      instances: 1,
      time: false,
    },
  ],
};

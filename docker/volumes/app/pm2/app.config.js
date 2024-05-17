const os = require("os");

module.exports = {
  apps: [
    {
      name: os.hostname(),
      script: process.env.PM2_SCRIPT, // "yarn run start:debug",
      autorestart: process.env.PM2_AUTORESTART,
      cwd: process.env.PM2_CWD || "/var/www/app",
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
      time: false,
    },
  ],
};

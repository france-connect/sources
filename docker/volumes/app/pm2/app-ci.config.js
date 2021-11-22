const os = require("os");

module.exports = {
  apps: [
    {
      name: os.hostname(),
      script: process.env.PM2_CI_SCRIPT,
      autorestart: process.env.PM2_AUTORESTART,
      cwd: process.env.PM2_CWD || "/var/www/app",
      out_file: process.env.PM2_OUT_FILE || "",
      time: false,
    },
  ],
};

const os = require("os");

module.exports = {
  apps: [
    {
      name: os.hostname(),
      script: process.env.PM2_SCRIPT, // "yarn run start:debug",
      autorestart: process.env.PM2_AUTORESTART,
      cwd: process.env.PM2_CWD || "/var/www/app",
      out_file: process.env.PM2_OUT_FILE || "",
      node_args: "--inspect=0.0.0.0:9229", //53000
      time: false,
    },
  ],
};

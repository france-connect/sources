const os = require("os");

const instances =
  process.env.PM2_NB_INSTANCES == "max"
    ? process.env.PM2_NB_INSTANCES
    : parseInt(process.env.PM2_NB_INSTANCES, 10) || 1;

module.exports = {
  apps: [
    {
      name: os.hostname(),
      script: "main.js",
      error_file: "/data/log/app/error.log",
      out_file: "/data/log/app/out.log",
      watch: false,
      autorestart: false,
      cwd: "/var/www/app/",
      exec_mode: "cluster",
      instances,
      time: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

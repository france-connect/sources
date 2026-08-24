const os = require("os");

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
      instances: "max",
      time: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

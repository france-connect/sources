module.exports = {
  apps: [
    {
      name: process.env.APP_NAME,
      script: "main.js",
      error_file: "/data/log/app/error.log",
      out_file: "/data/log/app/out.log",
      watch: false,
      autorestart: false,
      cwd: "/var/www/app/",
      exec_mode: "fork",
      instances: 1,
      time: false,

      // default args: “deployment” (can be overriden via `docker run`)
      args: process.env.CLI_ARGS || "deployment",

      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

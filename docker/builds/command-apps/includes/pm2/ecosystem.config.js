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

      args: process.env.COMMAND_ARGS,

      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

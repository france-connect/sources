# Command-Pre-Deploy

Command-line application for executing pre-deployment shell scripts for FranceConnect instances.

## Description

This is a one-shot command that runs before deployment to execute instance-specific pre-deploy scripts. It looks for shell scripts in predefined locations and executes them if they exist.

## Architecture

```
instances/command-pre-deploy/
├── src/
│   ├── commands/
│   │   ├── pre-deploy.command.ts         # Main command implementation
│   │   ├── pre-deploy.command.spec.ts    # Command tests
│   │   └── index.ts
│   ├── config/
│   │   ├── app.ts                        # App configuration
│   │   ├── logger.ts                     # Logger configuration
│   │   └── index.ts
│   ├── dto/
│   │   ├── app-cli-config.dto.ts         # App configuration schema
│   │   ├── pre-deploy-config.dto.ts      # Root config schema
│   │   └── index.ts
│   ├── services/
│   │   ├── command-pre-deploy.service.ts      # Pre-deploy business logic
│   │   ├── command-pre-deploy.service.spec.ts # Service tests
│   │   └── index.ts
│   ├── app.module.ts                     # NestJS module
│   └── main.ts                           # Application entry point
└── tsconfig.app.json
```

## How it works

1. The command reads `APP` and `NODE_ENV` environment variables
2. It looks for a pre-deploy script at: `/var/www/app/deploy/{NODE_ENV}/pre-deploy.sh`
3. If the script exists, it executes it from the base path
4. If no script is found, it exits successfully (no pre-deploy actions needed)

## Configuration

### Required environment variables

| Variable | Description | Allowed values |
|----------|-------------|----------------|
| `APP` | Target application name | Any instance name (e.g., `partners`) |
| `NODE_ENV` | Target environment | `development` or `production` |

### Logger configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `Logger_THRESHOLD` | Minimum log level | `debug` |

## Adding a pre-deploy script

To add a pre-deploy script for an instance:

1. Create the deploy directory structure:
   ```bash
   mkdir -p back/instances/{app-name}/deploy/{environment}/
   ```

2. Create the `pre-deploy.sh` script:
   ```bash
   #!/bin/bash
   # Pre-deploy script for {app-name} in {environment}

   # Your pre-deploy commands here
   yarn typeorm:migrations-run
   ```

3. Make it executable:
   ```bash
   chmod +x back/instances/{app-name}/deploy/{environment}/pre-deploy.sh
   ```

## Usage

### Via Docker (CI/CD)

The command is typically executed in CI/CD pipelines via Docker. Each app has its own pre-deploy image:

```bash
docker run --rm \
  -e APP=partners \
  -e NODE_ENV=production \
  registry.gitlab.dev-franceconnect.fr/france-connect/fc/nodejs-apps/partners-pre-deploy:latest
```

### Local development

```bash
cd back
yarn build:partners
APP=partners NODE_ENV=development node dist/instances/partners/main.js command-pre-deploy
```

## Exit codes

| Code | Description |
|------|-------------|
| `0` | Success (script executed or no script found) |
| `1` | Error (missing environment variable or script execution failed) |

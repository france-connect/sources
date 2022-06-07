#!/bin/bash

yarn fixtures "./fixtures/$APP_NAME" --config ./typeorm.config.ts --require=ts-node/register --require=tsconfig-paths/register
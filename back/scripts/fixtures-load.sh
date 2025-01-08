#!/bin/bash

yarn fixtures load "./fixtures/$APP_NAME" -d ./typeorm.config.ts --require=ts-node/register --require=tsconfig-paths/register
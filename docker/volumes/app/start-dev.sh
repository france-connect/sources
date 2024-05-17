#!/bin/bash

pm2 delete all
pm2 start /opt/scripts/pm2/app.config.js

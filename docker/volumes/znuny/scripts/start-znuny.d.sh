#!/bin/bash

set -e

mkdir -p /opt/otrs/env
mkdir -p /opt/otrs/Kernel

# Copy SSL client certificates, to prevent Znuny from changing permissions on mounted files
cp /tmp/postgres.znuny.client.* /etc/ssl/

chown www-data:www-data /etc/ssl/postgres.znuny.client.*
chmod 600 /etc/ssl/postgres.znuny.client.key
chmod 644 /etc/ssl/postgres.znuny.client.crt

# Copy Znuny environment variables and configuration since other script will alter or require permissions on these files
cp /tmp/znuny.env /opt/otrs/env/znuny.env
cp /tmp/Config.pm /opt/otrs/Kernel/Config.pm

chmod 600 /opt/otrs/Kernel/Config.pm
chmod 600 /opt/otrs/env/znuny.env

#!/usr/bin/env bash

set -euo pipefail

# This command is not part of the original Znuny start script.
init-apache-env.sh || exit 1
start-znuny.d.sh || exit 1
init-database.sh || exit 1
inject-fixtures.sh || exit 1

# Set Permission on all files
/opt/otrs/bin/otrs.SetPermissions.pl

# Update Database
if [ "${ZNUNY_UPDATE:-}" == 'yes' ]; then
  echo "Update option selected. Updating..."
  su -c "source /etc/profile.d/znuny-env.sh 2>/dev/null || true; /opt/otrs/scripts/DBUpdate-to-6.pl" -s /bin/bash otrs
elif [ "${ZNUNY_UPGRADE:-}" == 'yes' ]; then
  echo "Upgrade option selected. Updating..."
  su -c "source /etc/profile.d/znuny-env.sh 2>/dev/null || true; /opt/otrs/scripts/MigrateToZnuny6_5.pl" -s /bin/bash otrs
else
  echo "No option selected"
fi

service cron start

# Start Apache with environment variables
# Apache will inherit the environment from this script
apachectl -D FOREGROUND

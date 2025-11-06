#!/bin/sh

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <target1> [target2 ...]"
  exit 1
fi

# Those applications do not use the generic matrix and have specific bake targets
SPECIFIC_TARGETS="csmr-hsm-high command-runner command-import-sp-sandbox"

. "$(dirname "$0")/utils.sh"

# Needed to avoid new manifest and digest system (gitlab registry upgrade required)
export BUILDX_NO_DEFAULT_ATTESTATIONS=1

# To leverage cache from the docker registry we need not to use the default builder
echo "Setting up docker buildx driver..."

docker buildx create --name docker-container-driver --driver docker-container --use \
  --driver-opt env.http_proxy=$INTERNET_PROXY \
  --driver-opt env.https_proxy=$INTERNET_PROXY

# Cache busting for npm dependencies
echo "Calculating yarn.lock digest..."

NODE_MODULE_VERSION=$(sha256sum back/yarn.lock | cut -c1-12)
export NODE_MODULE_VERSION

echo "Generating application list from instances on the monorepo..."

# Get the list of applications to
APP_LIST=$(get_app_list "$SPECIFIC_TARGETS")
export APP_LIST

echo "List:" "$APP_LIST"

echo "
⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⡿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⢿⣧⠀⠀⠀⠀⠀
⢀⣀⣀⣀⣀⣸⣇⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣸⣿⣀⣀⣀⣀⠀
⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇
⠀⠀⠀⠉⢙⣿⡿⠿⠿⠿⠿⠿⢿⣿⣿⣿⠿⠿⠿⠿⠿⢿⣿⣛⠉⠁⠀⠀
⠀⠀⠀⣰⡟⠉⢰⣶⣶⣶⣶⣶⣶⡶⢶⣶⣶⣶⣶⣶⣶⡆⠉⠻⣧⠀⠀⠀
⠀⠀⠀⢻⣧⡀⠈⣿⣿⣿⣿⣿⡿⠁⠈⢿⣿⣿⣿⣿⣿⠁⠀⣠⡿⠀⠀⠀
⠀⠀⠀⠀⠙⣿⡆⠈⠉⠉⠉⠉⠀⠀⠀⠀⠉⠉⠉⠉⠁⢰⣿⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⣠⣶⣶⣶⣶⣶⣶⣄⠀⠀⠀⢸⣿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠸⣷⡀⠀⠀⣿⠛⠉⠉⠉⠉⠛⣿⠀⠀⢀⣾⠇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠘⢿⣦⡀⣿⣄⠀⣾⣷⠀⣠⣿⣀⣴⡟⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
"

echo "Ready to bake..."

# Buildx bake command
docker buildx bake --progress=plain -- dependencies prod-base $@

# Cleanup proxy

docker buildx stop docker-container-driver
docker buildx rm docker-container-driver

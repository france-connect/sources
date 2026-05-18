#!/usr/bin/env bash

set -e

# ===========================
# Configuration
# ===========================

BUILDX_DRIVER_NAME="docker-container-driver"

# Applications that do not use the generic matrix and have specific bake targets
SPECIFIC_TARGETS="csmr-hsm-high command-runner command-import-sp-sandbox command-import-datapass command-pre-deploy"

# ===========================
# Helper Functions
# ===========================

# List all instances excluding specific targets
_get_app_list() {
  local exclude_list="${1}"
  local app_list=$(find $FC_ROOT/fc/back/instances/ -maxdepth 1 -mindepth 1 -type d -print 2>/dev/null | xargs -n1 basename)

  for exclude_item in ${exclude_list}; do
    app_list=$(echo "${app_list}" | grep -v "${exclude_item}")
  done

  echo "${app_list}" | tr '\n' ',' | sed 's/,$//'
}

# Format app list as JSON array: ["app1","app2",...]
_jsonify_app_list() {
  local app_list="$1"
  local result=""
  local old_ifs=${IFS}

  IFS=,
  set -- ${app_list}
  for item; do
    result="\"${item}\",${result}"
  done
  IFS=${old_ifs}

  result=$(echo "${result}" | sed 's/,$//')
  echo "[${result}]"
}

# Generate and export application list
_generate_app_list() {
  echo "Generating application list from instances on the monorepo..."

  export APP_LIST=$(_get_app_list "$SPECIFIC_TARGETS")

  echo "List: $APP_LIST"
}

# Print ASCII art
_print_ascii_art() {
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
}

# Setup buildx driver with proxy configuration
_setup_buildx_driver() {
  echo "Setting up docker buildx driver..."

  docker buildx create \
    --name "${BUILDX_DRIVER_NAME}" \
    --driver docker-container \
    --use \
    --bootstrap \
    --driver-opt env.http_proxy="${INTERNET_PROXY}" \
    --driver-opt env.https_proxy="${INTERNET_PROXY}"
}

# Cleanup buildx driver
_cleanup_buildx_driver() {
  echo "Cleaning up buildx driver..."

  docker buildx stop "${BUILDX_DRIVER_NAME}" 2>/dev/null || true
  docker buildx rm "${BUILDX_DRIVER_NAME}" 2>/dev/null || true
}

# Execute bake for a specific docker-bake.hcl file
_bake_file() {
  # Disable filesystem entitlements checks
  export BUILDX_BAKE_ENTITLEMENTS_FS=0

  local bake_file="$1"
  shift

  if [ ! -f "${bake_file}" ]; then
    echo "Error: Bake file '${bake_file}' not found"
    exit 1
  fi

  # Change to project root to ensure correct context
  cd "${FC_ROOT}/fc"

  # Setup buildx driver
  _setup_buildx_driver

  # Ensure cleanup happens on script exit
  trap _cleanup_buildx_driver EXIT

  # Print ASCII art
  _print_ascii_art
  echo "Ready to bake: ${bake_file}"

  # Execute bake command with specific file
  docker buildx bake --progress=plain -f "${FC_ROOT}/fc/docker-bake.hcl" -f "${bake_file}" -- "$@"
}

# ===========================
# Main Functions
# ===========================

_bake_ci_cd_slim() {
  # Bake for CI/CD slim image used in main builds
  _bake_file ${FC_ROOT}/fc/docker/builds/ci-cd/docker-bake.hcl "ci-cd-slim"
}

_bake_ci_cd_full() {
  # Bake for CI/CD full image used in tests
  _bake_file ${FC_ROOT}/fc/docker/builds/ci-cd/docker-bake.hcl "ci-cd-full"
}

_bake_dev_generic() {
  # Bake for CI/CD full image used in main builds
  _bake_file ${FC_ROOT}/fc/docker/builds/ci-cd/docker-bake.hcl "dev-generic"
}

# Execute bake for root docker-bake.hcl (with app list and node versions)
_bake_nodejs_app() {
  # Generate application list
  _generate_app_list

  # Run bake with all targets
  _bake_file ${FC_ROOT}/fc/docker/builds/nodejs-apps/docker-bake.hcl "$@"
}

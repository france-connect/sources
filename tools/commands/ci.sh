#!/usr/bin/env bash

set -e

# Dirty hack:
# This variable is used to discriminate successful output from error output
# Every lines begining with this value are considered as a path to a modified file
BACK_PREFIX="back"
FRONT_PREFIX="front"

_get_hardcoded_back_files() {
  echo "${BACK_PREFIX}/yarn.lock"
}

_get_hardcoded_front_files() {
  echo "${FRONT_PREFIX}/yarn.lock"
}

_get_back_app_files() {
  local app="${1}"

  local hardCoded=$(_get_hardcoded_back_files)
  local appFiles=$(
    cat "${FC_ROOT}/fc/back/dist/instances/${app}/stats.json" |
      grep -Eo '"moduleName": "./([^"]+)' |
      sed "s#\"moduleName\": \"./#${BACK_PREFIX}/#"
  )

  echo -e "${hardCoded}\n${appFiles}" | sort | uniq
}

_get_front_app_files() {
  local app="${1}"

  local appMapDir="${FC_ROOT}/fc/front/instances/${app}/build/assets"
  cd ${appMapDir}

  local relativeFiles=$(cat index-*.js.map | jq ".sources" | grep -Eo '(../[^"]+)')

  local absoluteFiles=$(
    for relativeFile in ${relativeFiles}; do
      # Perform some operation on each app
      _get_abs_path "${relativeFile}"
    done
  )

  local hardCoded=$(_get_hardcoded_front_files)
  echo -e "${hardCoded}\n${absoluteFiles}" | sort | uniq
}

_get_back_diff_files() {
  local refRevision="${1}"

  cd $FC_ROOT/fc
  git diff --name-only "${refRevision}" -- "./${BACK_PREFIX}/" | sort
}

_get_front_diff_files() {
  local refRevision="${1}"

  cd $FC_ROOT/fc
  git diff --name-only "${refRevision}" -- "./${FRONT_PREFIX}/" | sort
}

_get_abs_path() {
  local relativePath="${1}"

  local dir=$(dirname "${relativePath}")

  local file=$(basename "${relativePath}")

  cd "${dir}"
  local absDir=$(pwd)
  cd - >/dev/null

  local repoRelativDir=$(echo "${absDir}" | sed "s#${FC_ROOT}/fc/##")
  echo "${repoRelativDir}/${file}"
}

_get_modified_files_for_back_app() {
  local app="${1}"
  local refRevision=$(git ls-remote origin "${2}" | cut -d$'\t' -f1)
  local fetchResult=$(git fetch origin "${refRevision}" &>/dev/null)

  local appFiles=$(_get_back_app_files "${app}")
  local diffFiles=$(_get_back_diff_files "${refRevision}")

  comm -12 <(echo "${diffFiles}") <(echo "${appFiles}")
}

_get_modified_files_for_front_app() {
  local app="${1}"
  local refRevision=$(git ls-remote origin "${2}" | cut -d$'\t' -f1)
  local fetchResult=$(git fetch origin "${refRevision}" &>/dev/null)

  local appFiles=$(_get_front_app_files "${app}")
  local diffFiles=$(_get_front_diff_files "${refRevision}")

  comm -12 <(echo "${diffFiles}") <(echo "${appFiles}")
}

_get_modified_files_for_back_apps() {
  local refRevision="${!#}"
  local apps=()

  local i
  for ((i = 1; i < $#; i++)); do
    apps+=("${!i}")
  done

  local output=$(
    for app in "${apps[@]}"; do
      # Perform some operation on each app
      _get_modified_files_for_back_app "${app}" "${refRevision}"
    done
  )

  echo "${output}" | sort | uniq
}

_get_modified_files_for_front_apps() {
  local refRevision="${!#}"
  local apps=()

  local i
  for ((i = 1; i < $#; i++)); do
    apps+=("${!i}")
  done

  local output=$(
    for app in "${apps[@]}"; do
      # Perform some operation on each app
      _get_modified_files_for_front_app "${app}" "${refRevision}"
    done
  )

  echo "${output}" | sort | uniq
}

_ci_job_relevant_for_back_apps() {
  if [ "${SKIP_DIFF_CHECK}" == "true" ]; then
    echo "STATUS=SKIP"
    exit 0
  fi

  if [ "${CI_MERGE_REQUEST_TARGET_BRANCH_NAME}" == "" ]; then
    echo "STATUS=ERRORS"
    echo "❌ the variable CI_MERGE_REQUEST_TARGET_BRANCH_NAME is not set"
    echo "Exiting job with failure"
    exit 0
  fi

  # Build the apps to obtain the stats file
  cd "${CI_PROJECT_DIR}/back"

  if [[ ${CI_MERGE_REQUEST_LABELS} == *"CI Refresh Cache"* ]]; then
    echo "Refreshing cache (rm -rf node_modules/)"
    rm -rf node_modules
  fi

  # --frozen-lockfile  Do not update yarn.lock
  # --ignore-engines Temporary fix for runner
  yarn install --frozen-lockfile --ignore-engines

  local i
  for ((i = 1; i <= $#; i++)); do
    local app="${!i}"
    echo "buiding ${app}"
    yarn "build:${app}"
  done

  # Search for updated files
  local files=$(_get_modified_files_for_back_apps "${@}" "${CI_MERGE_REQUEST_TARGET_BRANCH_NAME}" 2>&1)

  _analyse_diff_results ${BACK_PREFIX}/ "${files}"

  if [[ ${CI_MERGE_REQUEST_LABELS} == *"CI Refresh Cache"* ]]; then
    rm -rf node_modules
  fi
}

_ci_job_relevant_for_front_apps() {
  if [ "${SKIP_DIFF_CHECK}" == "true" ]; then
    echo "STATUS=SKIP"
    exit 0
  fi

  if [ "${CI_MERGE_REQUEST_TARGET_BRANCH_NAME}" == "" ]; then
    echo "STATUS=ERRORS"
    echo "❌ the variable CI_MERGE_REQUEST_TARGET_BRANCH_NAME is not set"
    echo "Exiting job with failure"
    exit 0
  fi

  if [[ ${CI_MERGE_REQUEST_LABELS} == *"CI Refresh Cache"* ]]; then
    echo "Refreshing cache (rm -rf node_modules/)"
    rm -rf node_modules
  fi

  # Build the apps to obtain the stats file
  cd ${CI_PROJECT_DIR}/front
  yarn install --frozen-lockfile --ignore-engines

  local i
  for ((i = 1; i <= $#; i++)); do
    local app="${!i}"
    echo "buiding ${app}"
    yarn build "${app}"
  done

  # Search for updated files
  local files=$(_get_modified_files_for_front_apps "${@}" "${CI_MERGE_REQUEST_TARGET_BRANCH_NAME}" 2>&1)

  _analyse_diff_results ${FRONT_PREFIX}/ "${files}"

  if [[ ${CI_MERGE_REQUEST_LABELS} == *"CI Refresh Cache"* ]]; then
    rm -rf node_modules
  fi
}

_analyse_diff_results() {
  local prefix="${1}"
  local files="${2}"

  local errors=$(echo "${files}" | grep -Ev "^${prefix}.+$")

  if [ "${errors}" != "" ]; then
    echo "STATUS=ERRORS"
    echo "❌ An error occured in file changes detection:"
    echo "${errors}"
    echo "---------"
    echo "${files}"
    echo "Exiting job with failure"

  elif [ -z "${files}" ]; then
    echo "STATUS=NO_CHANGES"
    echo "✅ No file were updated in relevant applications"
    echo "Exiting job with success"

  else
    echo "STATUS=CHANGES_FOUND"
    echo "🔍 Some files in relevant apps where updated in current revision"
    echo "Pursuing the job..."
    echo "List of updated files:"
    echo "${files}" | sed "s#${prefix}# - ${prefix}#"

  fi
}

_ci_run_validate_code_back() {
  cd ${FC_ROOT}/fc/back

  yarn doc
  git --no-pager diff --exit-code -- . || (echo "💥 You forgot documentation 💥" && exit 1)
  yarn generate-oidc-provider-exceptions
  git --no-pager diff --exit-code -- . || (echo "💥 oidc-provider runtime exceptions diff detected 💥" && exit 1)
  yarn prettier
  yarn lint
  yarn test:cov:ci
  ${FC_ROOT}/fc/coverage.sh
}

_ci_create_front_workspaces() {
  cd ${FC_ROOT}/fc/front

  # Install local workspaces dependencies
  # To prevent too much cache busting, those are not added to the dev-generic image.
  # Feel free to propose a better solution if you have one.
  yarn workspaces info --json \
  | sed '1d;$d' \
  | jq -r 'to_entries[] | "\(.key) \(.value.location)"' \
  | xargs -n2 sh -c '
      mkdir -p "node_modules/$(dirname "$1")"
      ln -sfn "../../$2" "node_modules/$1"
    ' _
}

_ci_run_validate_code_front() {
  cd ${FC_ROOT}/fc/front

  _ci_create_front_workspaces

  yarn i18n:generate
  git --no-pager diff --exit-code -- . || (echo "💥 You forgot i18n generation 💥" && exit 1)
  yarn prettier
  yarn lint
  yarn test:cov:ci
  ${FC_ROOT}/fc/coverage.sh
}

_ci_run_validate_code_quality() {
  cd ${FC_ROOT}/fc/quality

  # Partners checks
  cd ${FC_ROOT}/fc/quality/partners
  yarn prettier
  yarn lint
  yarn tsc --noEmit

  # Fcp checks
  cd ${FC_ROOT}/fc/quality/fcp
  yarn prettier
  yarn lint
  yarn tsc --noEmit

  # Tests with coverage
  cd ${FC_ROOT}/fc/quality
  yarn test --coverage --runInBand
  ${FC_ROOT}/fc/coverage.sh
}

_ci_dev-generic_cache_resolve() {
  local image="${REGISTRY_URL}/dev-generic"
  local generic_tag="${NODE_MODULE_BACK_VERSION}-${NODE_MODULE_FRONT_VERSION}-${NODE_MODULE_QUALITY_VERSION}"
  local target_tag="${CI_COMMIT_REF_SLUG}"

  # On staging, force cache to hit only on node_modules to prevent error when dependencies update
  if [[ "${target_tag}" != "${REPOSITORY_MAIN_BRANCH}" ]] \
    && [[ "${CI_MERGE_REQUEST_LABELS:-}" != *"CI Refresh Cache"* ]] \
    && _docker_image_exists "${image}" "${target_tag}"; then
    echo "🟢 Cache hit on target → skipping build."
    return 0
  fi

  if _docker_image_exists "${image}" "${generic_tag}"; then
    echo "🔵 Cache hit on node_modules → retag and skipping build."

    if _docker_image_retag --overwrite "${image}" "${generic_tag}" "${target_tag}"; then
      echo "🟢 Target ready !"
      return 0
    fi

    echo "🟠 Unable to retag, will still try to re-build."
    return 1
  fi

  echo "🟡 No cache hit, build is needed."
  return 1
}

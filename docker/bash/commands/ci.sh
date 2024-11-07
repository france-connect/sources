#!/usr/bin/env bash

# Dirty hack:
# This variable is used to discriminate successful output from error output
# Every lines begining with this value are considered as a path to a modified file
BACK_PREFIX="back/"
FRONT_PREFIX="front/"

_get_hardcoded_back_files() {
  echo "${BACK_PREFIX}yarn.lock"
  echo "${BACK_PREFIX}package.json"
  echo "${BACK_PREFIX}nest-cli.json"
}

_get_hardcoded_front_files() {
  echo "/${FRONT_PREFIX}yarn.lock"
  echo "/${FRONT_PREFIX}package.json"
}

_get_back_app_files() {
  local app="${1}"

  local hardCoded=$(_get_hardcoded_back_files)
  local appFiles=$(
    cat "${FC_ROOT}/fc/back/dist/instances/${app}/stats.json" |
      grep -Eo '"moduleName": "./([^"]+)' |
      sed "s#\"moduleName\": \"./#${BACK_PREFIX}#"
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
  git diff --name-only "${refRevision}" -- "./${BACK_PREFIX}" | sort
}

_get_front_diff_files() {
  local refRevision="${1}"

  cd $FC_ROOT/fc
  git diff --name-only "${refRevision}" -- "./${FRONT_PREFIX}" | sort
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

  # Build the apps to obtain the stats file
  cd "${CI_PROJECT_DIR}/back"

  # Temp addition to build
  apt update
  apt install -y make g++

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

  _analyse_diff_results ${BACK_PREFIX} "${files}"

  if [[ ${CI_MERGE_REQUEST_LABELS} == *"CI Refresh Cache"* ]]; then
    rm -rf node_modules
  fi
}

_ci_job_relevant_for_front_apps() {
  if [ "${SKIP_DIFF_CHECK}" == "true" ]; then
    echo "STATUS=SKIP"
    exit 0
  fi

  # Build the apps to obtain the stats file
  cd ${CI_PROJECT_DIR}/front
  yarn install --frozen-lockfile

  local i
  for ((i = 1; i <= $#; i++)); do
    local app="${!i}"
    echo "buiding ${app}"
    yarn build "${app}"
  done

  # Search for updated files
  local files=$(_get_modified_files_for_front_apps "${@}" "${CI_MERGE_REQUEST_TARGET_BRANCH_NAME}" 2>&1)

  _analyse_diff_results ${FRONT_PREFIX} "${files}"
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

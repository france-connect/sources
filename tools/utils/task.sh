#!/usr/bin/env bash

task() {
  local message=${1}
  local cmd=${2}
  local args=${@:3}

  if [ -z $VERBOSE ]; then
    echo -ne "${message}: "
    ($(${cmd} ${args} &>"$__DKS_LAST_LOG_FILE") && _task_success) || _task_fail "$1" "$2" "$?"
  else
    ${cmd} ${args}
  fi
}

_task_success() {
  echo $(format_success "OK")
}

_task_fail() {
  local message=${1}
  local cmd=${2}
  local exitcode=${3}

  if [ "$exitcode" == "$__DKS_TASK_RETURN_EXIT_CODE" ]; then
    cat "$__DKS_LAST_LOG_FILE"
  else
    echo $(format_failure "Failed")
    echo -e "   - command: > ${cmd}"
    echo "   - result:"
    echo " -------------------------------- "
    cat "$__DKS_LAST_LOG_FILE"
    echo " -------------------------------- "
    echo -e "${message}: KO"
    exit 1
  fi
}

_task_result() {
  local message=$1
  local newline=$2

  echo -ne "$message"

  if [ -n "$newline" ]; then
    echo ""
  fi

  if [ -z $VERBOSE ]; then
    exit ${__DKS_TASK_RETURN_EXIT_CODE}
  fi
}

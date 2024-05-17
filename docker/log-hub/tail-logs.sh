#!/usr/bin/env bash

# This small script is only useful as a workarround
# to leverage shell filenames expansion via "*" wildcard
# that is not interpreted when lauching chiold process with `spawn` in nodejs
# @see https://stackoverflow.com/questions/11717281/wildcards-in-child-process-spawn

PID_FILE="./.pid"

main() {
  local logPath=${1}

  _logs_kill_instance

  tail -qfn 0 ${logPath}/*.log

  $! >${PID_FILE}
}

_logs_kill_instance() {
  if [ -f "${LOGS_PID_FILE}" ]; then
    if kill -0 $(cat "${LOGS_PID_FILE}") 2>/dev/null; then
      kill $(cat "${LOGS_PID_FILE}")
      rm -f "${LOGS_PID_FILE}"
    else
      rm -f "${LOGS_PID_FILE}"
    fi
  fi
}

main "${@}"

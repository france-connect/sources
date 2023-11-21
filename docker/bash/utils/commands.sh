#!/usr/bin/env bash

declare -A __CMD_COMMANDS
declare -A __CMD_USAGES

function _command_register() {
  local key=$1
  local command=$2
  local usage=$3

  __CMD_COMMANDS[${key}]+=$command
  __CMD_USAGES[${key}]+=$usage
}

function _command_run() {
  local key=$1

  if [ -v ${key} ]; then
    echo "No command found"
    echo "Use help to see all available commands:"
    echo " > ./docker-stack help"
    exit 1
  fi

  local cmd=${__CMD_COMMANDS[${key}]}

  if [ -v ${cmd} ]; then
    echo "Command not found: <${key}>"
    echo "Use help to see all available commands:"
    echo " > ./docker-stack help"
    exit 1
  fi

  $cmd ${@:2}
}

function _command_list() {
  local search=$1

  echo ""
  echo "Available commands:"

  if [ -z ${search} ]; then
    echo "$(_do_list_commands | sort)"
  else
    echo "$(_do_list_commands | grep "${search}" | sort)"
  fi

  echo "---------------------------"
  echo "Use env variable 'VERBOSE' to get verbose output"
  echo "ex."
  echo "> VERBOSE=1 docker-stack up min-core-legacy"
}

function _do_list_commands() {
  for i in "${!__CMD_USAGES[@]}"; do
    echo -e " * \e[1;36m${i}\e[0;0m: ${__CMD_USAGES[${i}]}"
  done

}

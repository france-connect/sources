#!/usr/bin/env bash

set -e

format_success() {
  printf "${STYLE_SUCCESS}${1}${STYLE_RESET}"
}

format_failure() {
  printf "${STYLE_FAILURE}${1}${STYLE_RESET}"
}

format_warning() {
  printf "${STYLE_WARNING}${1}${STYLE_RESET}"
}

format_emphasis() {
  printf "${STYLE_EMPHASIS}${1}${STYLE_RESET}"
}

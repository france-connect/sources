#!/usr/bin/env bash

_cypress() {
  # stack compose run --rm cypress-partners yarn test
  local service=$1
  shift
  ${DOCKER_COMPOSE} run --rm cypress-${service} $@
}

# Aliases

## fcp workspace

_bdd_fcp_report() {
  _cypress "fcp" "yarn report"
}

_bdd_eidas_open() {
  _cypress "fcp" "yarn start:eidas $@"
}

_bdd_eidas_test() {
  _cypress "fcp" "yarn test:eidas $@"
}

_bdd_eidas_test_visual() {
  _cypress "fcp" "yarn test:eidas:snapshot $@"
}

_bdd_exploitation_open() {
  _cypress "exploitation" "yarn cypress open -P fc-exploitation --e2e $@"
}

_bdd_exploitation_test() {
  _cypress "exploitation" "yarn cypress run -P fc-exploitation --e2e $@"
}

_bdd_high_open() {
  _cypress "fcp" "yarn start:high $@"
}

_bdd_high_test() {
  _cypress "fcp" "yarn test:high $@"
}

_bdd_high_test_visual() {
  _cypress "fcp" "yarn test:high:snapshot $@"
}

_bdd_low_open() {
  _cypress "fcp" "yarn start:low $@"
}

_bdd_low_test() {
  _cypress "fcp" "yarn test:low $@"
}

_bdd_low_test_visual() {
  _cypress "fcp" "yarn test:low:snapshot $@"
}

_bdd_support_open() {
  _cypress "support" "yarn cypress open -P fc-support --e2e $@"
}

_bdd_support_test() {
  _cypress "support" "yarn cypress run -P fc-support --e2e $@"
}

_bdd_ud_open() {
  _cypress "fcp" "yarn start:ud $@"
}

_bdd_ud_test() {
  _cypress "fcp" "yarn test:ud $@"
}

_bdd_ud_test_visual() {
  _cypress "fcp" "yarn test:ud:snapshot $@"
}

## partners workspace

_bdd_partners_report() {
  _cypress "partners" "yarn report"
}

_bdd_partners_open() {
  _cypress "partners" "yarn start $@"
}

_bdd_partners_test() {
  _cypress "partners" "yarn test $@"
}

_bdd_partners_test_visual() {
  _cypress "partners" "yarn test:snapshot $@"
}
